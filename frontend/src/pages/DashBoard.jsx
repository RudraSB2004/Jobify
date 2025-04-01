import React from "react";
import RecruiterJobLeftSide from "../components/RecruiterLeftSide";
import useGetAllApplication from "../hooks/useGetAllApplication";
const DashBoard = () => {
  useGetAllApplication();
  console.log("get all application response");
  return (
    <div className="h-full w-full mt-3">
      <RecruiterJobLeftSide />
    </div>
  );
};

export default DashBoard;
