import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAppliedJobs } from "../redux/jobSlice";
import axios from "axios";

const useGetAppliedjobs = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const getAppliedJobs = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/application/jobseeker/getall`,
          {
            withCredentials: true,
          }
        );
        if (response.data.success) {
          dispatch(setAppliedJobs(response.data.application));
          console.log(response.data.application);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getAppliedJobs();
  }, []);
};

export default useGetAppliedjobs;
