import React from "react";
import { useSelector } from "react-redux";
import NoApplicationFound from "../components/NoApplicationFound.jsx";
import AppliedJobs from "../components/AppliedJobs.jsx";
import RecruiterJobLeftSide from "../components/RecruiterLeftSide";

const SeeAllApplication = () => {
  const { application } = useSelector((store) => store.job);

  return (
    <div className="min-h-screen w-screen flex  bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/6 min-h-screen">
        <RecruiterJobLeftSide />
      </div>
      <div className="w-5/6 flex justify-center pt-20 ">
        <div className="bg-white min-h-[500px] w-full max-w-4xl rounded-lg shadow-xl p-6">
          {application && application.length > 0 ? (
            application.map((app) => (
              <AppliedJobs key={app._id} application={app} />
            ))
          ) : (
            <NoApplicationFound />
          )}
        </div>
      </div>
    </div>
  );
};

export default SeeAllApplication;
