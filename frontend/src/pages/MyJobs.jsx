import React from "react";
import { useSelector } from "react-redux";
import RecruiterJobLeftSide from "../components/RecruiterLeftSide";
import Job from "../components/Job";
import NoJobsFound from "../components/NoJobsFound";

const MyJobs = () => {
  const { myJob = [] } = useSelector((store) => store.job);

  return (
    <div className="min-h-screen w-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/6 min-h-screen">
        <RecruiterJobLeftSide />
      </div>

      {/* Main Content */}
      <div className="w-5/6 flex justify-center pt-20">
        <div className="bg-white min-h-[500px] w-full max-w-4xl rounded-lg shadow-xl p-6">
          {myJob.length > 0 ? (
            myJob.map((job) => <Job key={job._id} job={job} />)
          ) : (
            <NoJobsFound />
          )}
        </div>
      </div>
    </div>
  );
};

export default MyJobs;
