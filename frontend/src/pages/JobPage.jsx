import React from "react";
import JobLeftSide from "../components/JobLeftSide.jsx";
import Jobs from "../components/Jobs.jsx";
import useGetAllApplication from "../hooks/useGetAllApplication";
import { useSelector } from "react-redux";
const JobPage = () => {
  const { user } = useSelector((store) => store.auth);
  if (user.role === "Recruiter") {
    useGetAllApplication();
  }
  return (
    <div className="h-full w-full mt-3">
      <JobLeftSide />
      <Jobs />
    </div>
  );
};

export default JobPage;
