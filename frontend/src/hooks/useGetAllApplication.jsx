import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setApplication } from "../redux/jobSlice";
import axios from "axios";

const useGetAllApplication = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const Applications = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/application/employer/getall`,
          {
            withCredentials: true,
          }
        );
        if (response.data.success) {
          console.log("all applications data", response.data);
          dispatch(setApplication(response.data.applications));
        }
      } catch (error) {
        console.log(error);
      }
    };
    Applications();
  }, []);
};

export default useGetAllApplication;
