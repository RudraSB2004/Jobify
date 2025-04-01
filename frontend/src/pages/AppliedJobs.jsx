import React, { useEffect } from "react";
import JobLeftSide from "../components/JobLeftSide";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import AppliedJobs from "../components/AppliedJobs";
import NoApplicationFound from "../components/NoApplicationFound";
const AppliedJobsPage = () => {
  const dispatch = useDispatch();
  const { appliedJobs } = useSelector((store) => store.job);

  return (
    <div className="h-full w-full grid grid-rows-2">
      <JobLeftSide />
      <div className="flex justify-center bg-white w-full h-full mx-96 mt-20 rounded-lg shadow-xl">
        <div className="pt-5">
          {appliedJobs && appliedJobs.length > 0 ? (
            appliedJobs.map((application) => (
              <AppliedJobs key={application._id} application={application} />
            ))
          ) : (
            <NoApplicationFound />
          )}
        </div>
      </div>
    </div>
  );
};

export default AppliedJobsPage;
