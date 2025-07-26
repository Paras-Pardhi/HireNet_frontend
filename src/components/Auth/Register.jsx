import React, { useContext, useState } from "react";
import { FaRegEyeSlash, FaRegUser } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { FaPencilAlt } from "react-icons/fa";
import { FaPhoneFlip } from "react-icons/fa6";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../Contexts/GlobalContext";
import { IoEyeOutline } from "react-icons/io5";

const Register = () => {
  // const [email, setEmail] = useState("");
  // const [name, setName] = useState("");
  // const [phone, setPhone] = useState("");
  // const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);
  // const [role, setRole] = useState("");
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    password: '',
  })
  const navigate = useNavigate()

  const [errors, setErrors] = useState({})

  const { isAuthorized, setIsAuthorized, user, setUser } = useContext(Context);
  const [showPasswordone, setShowPasswordone] = useState(false)
  const [showPasswordtwo, setShowPasswordtwo] = useState(false)

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
    name: [
      { required: true, message: "Please enter your Name! *" },
      { minLength: 3, message: "Name must contain at least 3 Characters! *" }
    ],
    email: [
      { required: true, message: "Please enter your Email! *" },
      { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Please enter a valid email address *" }
    ],
    phone: [
      { required: true, message: "Please enter your 10 digit mobile number! *" },
      { pattern: /^[0-9]{10}$/, message: "Please enter a valid contact number *" }
    ],
    password: [
      { required: true, message: "Please enter your Password! *" },
      { pattern: /^(?=.*[A-Z])(?=.*\d).+$/, message: "Password must be 8+ chars with 1 capital & 1 number *" }
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
  const togglePasswordtwo = () => {
    setShowPasswordtwo((prev) => !prev)
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    

    const formResult = validatForm(formData);
    if (Object.keys(formResult).length) return;
    
    if (formData.password == confirmPassword) {
      try {
        setIsSubmitting(true)
        const { data } = await axios.post(
          `https://hirenet-b.onrender.com/api/v1/user/register`,
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
          name: '',
          email: '',
          phone: '',
          role: '',
          password: '',
        })
        setIsAuthorized(true);
        navigate("/")
      } catch (error) {
        toast.error(error.response.data.message);
      }finally{
        setIsSubmitting(false)
      }
    } else {
      toast.error("Password and confirm password are not same")
    }
  };

  if (isAuthorized) {
    return <Navigate to={'/'} />
  }

  // console.log('formData',formData)


  return (
    <>
      <section className="authPage">
        <div className="container">
          <div className="header">
            {/* <img src="/hireLogo.png" alt="logo" /> */}
            <h3>Create a new account</h3>
          </div>
          <form onSubmit={handleRegister} noValidate>
            <div className="inputTag">
              <label>Register As</label>
              <div >
                <select value={formData.role} onChange={handleChange} name="role">
                  <option value="">Select Role</option>
                  <option value="Employer">Employer</option>
                  <option value="Job Seeker">Job Seeker</option>
                </select>
                <FaRegUser />
                <p className="validate-error-message">{errors.role}</p>
              </div>
            </div>
            <div className="inputTag">
              <label>Name</label>
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  value={formData.name}
                  name='name'
                  onChange={handleChange}
                />
                <FaPencilAlt />
                <p className="validate-error-message">{errors.name}</p>
              </div>
            </div>
            <div className="inputTag">
              <label>Email Address</label>
              <div>
                <input
                  type="email"
                  placeholder="abc@gmail.com"
                  value={formData.email}
                  name='email'
                  onChange={handleChange}
                />
                <MdOutlineMailOutline />
                <p className="validate-error-message">{errors.email}</p>
              </div>
            </div>
            <div className="inputTag">
              <label>Phone Number</label>
              <div>
                <input
                  type="number"
                  placeholder="12345678"
                  value={formData.phone}
                  name='phone'
                  onChange={handleChange}
                />
                <FaPhoneFlip />
                <p className="validate-error-message">{errors.phone}</p>
              </div>
            </div>
            <div className="inputTag">
              <label>Password</label>
              <div>
                <input
                  type={showPasswordone ? 'text' : 'password'}
                  placeholder="Your Password"
                  value={formData.password}
                  name='password'
                  onChange={handleChange}
                  required
                />
                {showPasswordone ? <IoEyeOutline data-testid="togglePass" onClick={togglePasswordone} /> : <FaRegEyeSlash onClick={togglePasswordone} data-testid="togglePass" />}
                <p className="validate-error-message">{errors.password}</p>
              </div>
            </div>
            <div className="inputTag">
              <label>Confirm Password</label>
              <div>
                <input
                  type={showPasswordtwo ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {showPasswordtwo ? <IoEyeOutline onClick={togglePasswordtwo} /> : <FaRegEyeSlash onClick={togglePasswordtwo} />}
                <p className="validate-error-message">{errors.password}</p>
              </div>
            </div>
            <button type="submit" data-testid="register-submit"  disabled={isSubmitting}>{isSubmitting ? 'Registering user...' : 'Register'}</button>
            <Link to={"/login"}>Login Now</Link>
          </form>
        </div>
        <div className="banner">
          <img src="/hireLogo.png" alt="login" />
        </div>
      </section>
    </>
  );
};

export default Register;
