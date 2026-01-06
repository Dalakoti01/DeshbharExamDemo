"use client";

import { setAllJobs } from "@/redux/authSlice";
import axios from "axios";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const useGetAllJobs = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const res = await axios.get("/api/getAllJobs");
        console.log("Fetch All Jobs Response:", res.data);
        if (res.data.success) {
          console.log("sab bhadiaa");
          toast.success(res.data.message);

          dispatch(setAllJobs(res.data.jobs));
        } else {
          console.log("Error fetching jobs: aur kesa h ", res.data.message);
          toast.error(res.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong while fetching jobs");
      }
    };
    fetchAllJobs();
  }, [dispatch]);
};

export default useGetAllJobs;
