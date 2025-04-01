import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { setMyJob } from "../redux/jobSlice";
import { useDispatch } from "react-redux";
import useGetAppliedjobs from "../hooks/useGetAppliedjobs";

const JobMain = () => {
  const dispatch = useDispatch();
  const getMyJobs = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/job/getmyjobs`,
        { withCredentials: true }
      );

      if (response.data.success) {
        dispatch(setMyJob(response.data.myJobs));
      }
    } catch (error) {
      console.log("Error");
    }
  };
  useGetAppliedjobs();
  useEffect(() => {
    getMyJobs();
  }, []);

  return (
    <div className="h-screen w-screen grid grid-cols-2">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default JobMain;
