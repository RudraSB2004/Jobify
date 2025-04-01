import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { setSelectedJob } from "../redux/jobSlice";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaDollarSign,
  FaClock,
} from "react-icons/fa";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Job = ({ job }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/job/delete/${job._id}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        dispatch(setSelectedJob(null));
        toast.success("Job Deleted Successfully");
        navigate("/");
      } else {
        toast.error("Failed to delete the job");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Card className="w-screen lg:w-full border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-blue-700">
          {job.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 text-gray-700">
        <p className="flex items-center">
          <FaBriefcase className="text-blue-500 mr-2" />
          <strong>Company:</strong>{" "}
          <span className="ml-2">{job.companyName}</span>
        </p>
        <p className="flex items-center">
          <FaMapMarkerAlt className="text-red-500 mr-2" />
          <strong>Location:</strong>{" "}
          <span className="ml-2">{job.location}</span>
        </p>
        <p className="flex items-center">
          <FaDollarSign className="text-green-500 mr-2" />
          <strong>Offer:</strong> <span className="ml-2">${job.salary}</span>
        </p>
        <p className="flex items-center">
          <FaClock className="text-yellow-500 mr-2" />
          <strong>Type:</strong> <span className="ml-2">{job.type}</span>
        </p>
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        {user?._id === job.postedBy ? (
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleDelete}
          >
            Delete Job
          </Button>
        ) : (
          <Button
            variant="default"
            className="w-full"
            onClick={() => {
              dispatch(setSelectedJob(job));
              navigate(`/jobs/${job._id}`);
            }}
          >
            Apply Now
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default Job;
