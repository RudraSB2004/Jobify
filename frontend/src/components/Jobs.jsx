import React from "react";
import Job from "./Job.jsx";
import { useSelector } from "react-redux";
import NoJobsFound from "./NoJobsFound.jsx";

const Jobs = () => {
  const { jobs } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="h-full absolute top-24  lg:left-[29rem] w-1/2">
      {jobs.length > 0 ? (
        jobs.map((job) => <Job key={job._id} job={job} />)
      ) : (
        <NoJobsFound />
      )}
    </div>
  );
};

export default Jobs;
