import React from "react";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "../hooks/useGetAppliedjobs";
import JobLeftSidebar from "../components/JobLeftSide";
import AppliedJobs from "../components/AppliedJobs";
import NoApplicationFound from "../components/NoApplicationFound";

const MyApplications = () => {
  useGetAppliedJobs();
  const { appliedJobs = [] } = useSelector((store) => store.job);

  return (
    <div className="min-h-screen w-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/6 min-h-screen">
        <JobLeftSidebar />
      </div>

      {/* Main Content */}
      <div className="w-5/6 flex justify-center pt-20">
        <div className="bg-white min-h-[500px] w-full max-w-4xl rounded-lg shadow-xl p-6">
          {appliedJobs.length > 0 ? (
            appliedJobs.map((job) => (
              <AppliedJobs key={job._id} application={job} />
            ))
          ) : (
            <NoApplicationFound />
          )}
        </div>
      </div>
    </div>
  );
};

export default MyApplications;
