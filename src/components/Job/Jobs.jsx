import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../Contexts/GlobalContext";
import toast from "react-hot-toast";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true)
  const observer = useRef()
  const fetchingRef = useRef(false);

  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();
  const [isJobLoading, setIsJobLoading] = useState(false)
  const loadingList = new Array(40).fill(null)

  const LIMIT = 12;

  useEffect(() => {
    if (!isAuthorized) {
      navigateTo("/");
    }
  }, [isAuthorized, navigateTo])

  const fetchJobs = async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    try {
      setIsJobLoading(true)
      const response = await axios.get(`https://hirenet-b.onrender.com/api/v1/job/getall?page=${page}&limit=${LIMIT}`,
        { withCredentials: true }
      )

      const newJobs = response.data.jobs
      if (newJobs.length == 0 || newJobs.length < LIMIT) {
        setHasMore(false);
      }

      // setJobs((prev) => [...prev, ...newJobs])
      setJobs((prevJobs) => {
        const allJobs = [...prevJobs, ...newJobs];
        const uniqueJobs = Array.from(new Map(allJobs.map(job => [job._id, job])).values());
        return uniqueJobs;
      });


    }
    catch (error) {
      toast.error("failed to load jobs");
    } finally {
      setIsJobLoading(false)
      fetchingRef.current = false;
    }
  }

  useEffect(() => {
    const idMap = new Map();
    jobs.forEach((job) => {
      if (idMap.has(job._id)) {
        // console.warn("❗ Duplicate ID found:", job._id);
      }
      idMap.set(job._id, true);
    });
  }, [jobs]);



  useEffect(() => {
    fetchJobs()
  }, [page]);

  const lastJobElementRef = useCallback(
    (node) => {
      if (isJobLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isJobLoading, hasMore]
  );


  // console.log("jobs", jobs)
  return (
    <>
      {
        isJobLoading ? (
          <>
            <div className="w-full flex items-center justify-center" >
              <div className="max-w-[1500px] flex items-center justify-center flex-wrap gap-12" id="skeleton-loading">
                {
                  loadingList.map((_, index) => {
                    return (
                      <div className='w-full min-w-[280px]  md:min-w-[320px] max-w-[280px] md:max-w-[320px]  bg-white rounded-sm shadow ' key={index}>
                        <div className='bg-slate-300 h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center animate-pulse'>
                        </div>
                        <div className='p-4 grid gap-3'>
                          <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black p-1 py-2 animate-pulse rounded-full bg-slate-200'></h2>
                          <p className='capitalize text-slate-500 p-1 animate-pulse rounded-full bg-slate-200  py-2'></p>
                          <div className='flex gap-3'>
                            <p className='text-red-600 font-medium p-1 animate-pulse rounded-full bg-slate-200 w-full  py-2'></p>
                            <p className='text-slate-500 line-through p-1 animate-pulse rounded-full bg-slate-200 w-full  py-2'></p>
                          </div>
                          <button className='text-sm  text-white px-3  rounded-full bg-slate-200  py-2 animate-pulse'></button>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>

          </>
        ) : (
          <section className="jobs page">
            <div className="container">
              <h1>ALL AVAILABLE JOBS</h1>
              <div className="banner">
                {jobs &&
                  jobs.map((element, index) => {
                    const isLastElement = index === jobs.length - 1;
                    return (
                      <div className="card" key={element._id} ref={isLastElement ? lastJobElementRef : null}>
                        <p>{element.title}</p>
                        <p>{element.category}</p>
                        <p>{element.country}</p>
                        <Link to={`/job/${element._id}`}>Job Details</Link>
                      </div>
                    );
                  })}
              </div>
            </div>
          </section>
        )
      }
    </>

  );
};

export default Jobs;
