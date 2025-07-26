import React, { useContext, useState } from "react";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { FaRegEyeSlash } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5"
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../Contexts/GlobalContext";

const Login = () => {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  // const [role, setRole] = useState("");
  const [showPasswordone, setShowPasswordone] = useState(false)

      const [isSubmitting, setIsSubmitting] = useState(false);
  // const [showPasswordtwo, setShowPasswordtwo] = useState(false)

  const { isAuthorized, setIsAuthorized } = useContext(Context);

  const [formData, setFormData] = useState({
    email: '',
    role: '',
    password: '',
  })

  const navigate = useNavigate()

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setFormData((prev) => (
      {
        ...prev, [e.target.name]: e.target.value
      }
    ))
    setErrors({})
  }

  const validateConfig = {
    role: [
      { required: true, message: "Role is required *" }
    ],
    email: [
      { required: true, message: "Please enter your Email! *" },
      { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Please enter a valid email address *" }
    ],
    password: [
      { required: true, message: "Please enter your Password! *" },
    ]
  }

  const validatForm = (data) => {
    let errorObj = {}
    Object.entries(data).forEach(([key, value]) => {
      validateConfig[key].some((rule) => {
        if (rule.required && !value) {
          errorObj[key] = rule.message
          return true;
        }
        if (rule.minLength && value.length < rule.minLength) {
          errorObj[key] = rule.message
          return true;
        }
        if (rule.pattern && !rule.pattern.test(value)) {
          errorObj[key] = rule.message
          return true
        }
      })
    })
    setErrors(errorObj)
    return errorObj;
  }


  const togglePasswordone = () => {
    setShowPasswordone((prev) => !prev)
  }
  // const togglePasswordtwo = () => {
  //   setShowPasswordtwo((prev) => !prev)
  // }

  const handleLogin = async (e) => {
    e.preventDefault();

    const formResult = validatForm(formData);
    if (Object.keys(formResult).length) return;
    setIsSubmitting(true)
   
      try {
        const { data } = await axios.post(
          `https://hirenet-b.onrender.com/api/v1/user/login`,
          { ...formData },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        toast.success(data.message);
        setFormData({
          email: '',
          role: '',
          password: '',
        })
        setIsAuthorized(true);
        navigate('/')
      } catch (error) {
        toast.error(error.response.data.message);
      }finally{
        setIsSubmitting(false)
      }
  };

  // console.log(formData)

  if (isAuthorized) {
    return <Navigate to={'/'} />
  }

  return (
    <>
      <section className="authPage">
        <div className="container">
          <div className="header">
            {/* <img src="/hireLogo.png" alt="logo" /> */}
            <h3>Login to your account</h3>
          </div>
          <form onSubmit={handleLogin} noValidate>
            <div className="inputTag">
              <label>Login As</label>
              <div>
                <select value={formData.role} name="role" onChange={handleChange}>
                  <option value="">Select Role</option>
                  <option value="Employer">Employer</option>
                  <option value="Job Seeker">Job Seeker</option>
                </select>
                <FaRegUser />
                <p className="validate-error-message">{errors.role}</p>
              </div>
            </div>
            <div className="inputTag">
              <label>Email Address</label>
              <div>
                <input
                  type="email"
                  placeholder="abc@gmail.com"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <MdOutlineMailOutline />
                <p className="validate-error-message">{errors.email}</p>
              </div>
            </div>
            <div className="inputTag">
              <label>Password</label>
              <div>
                <input
                  type={showPasswordone ? 'text' : 'password'}
                  placeholder="Your Password"
                  value={formData.password}
                  name="password"
                  onChange={handleChange}
                  required
                />
                {showPasswordone ? <IoEyeOutline data-testid="togglePass" onClick={togglePasswordone} /> : <FaRegEyeSlash onClick={togglePasswordone} data-testid="togglePass" />}
                <p className="validate-error-message">{errors.password}</p>
              </div>
            </div>
            <button data-testid="login-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Logging in...' : 'Login'}</button>
            <Link to={"/register"}>Register Now</Link>
          </form>
        </div>
        <div className="banner">
          <img src="/hireLogo.png" alt="login" />
        </div>
      </section>
    </>
  );
};

export default Login;
