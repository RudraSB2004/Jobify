import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import axios from "axios";
import JobLeftSidebar from "./JobLeftSide";
import RecruiterJobLeftSide from "./RecruiterLeftSide";

const CreateJob = () => {
  const [formData, setFormData] = useState({
    title: "",
    jobtype: "",
    location: "",
    companyName: "",
    introduction: "",
    responsibility: "",
    qualification: "",
    offer: "",
    salary: "",
    jobNiche: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(
        "Job url = " + `${import.meta.env.VITE_BACKEND_URL}/job/post`
      );
      console.log(formData);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/job/post`,
        formData,
        {
          withCredentials: true,
        }
      );
      console.log(formData);
      console.log(response.data);
      if (response.data.success) {
        toast.success("Job posted successfully!");
        setFormData({
          title: "",
          jobtype: "",
          location: "",
          companyName: "",
          introduction: "",
          responsibility: "",
          qualification: "",
          offer: "",
          salary: "",
          jobNiche: "",
        });
      } else {
        toast.error(response.data.error);
        console.log(response.data.error);
      }
    } catch (error) {
      toast.error("Failed to post job.");
      console.log(error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 w-screen">
      {/* Sidebar */}
      <div className="w-72 hidden lg:block">
        <RecruiterJobLeftSide />
      </div>

      {/* Form Container */}
      <div className="flex flex-1 justify-center items-center p-6 w-full mt-44">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 ml-60">
            Create a Job
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Job Title"
              required
            />
            <Select
              onValueChange={(value) =>
                setFormData({ ...formData, jobtype: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Full-Time">Full-Time</SelectItem>
                <SelectItem value="Part-Time">Part-Time</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
              </SelectContent>
            </Select>
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location"
              required
            />
            <Input
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Company Name"
              required
            />
            <Textarea
              name="introduction"
              value={formData.introduction}
              onChange={handleChange}
              placeholder="Introduction"
              required
            />
            <Textarea
              name="responsibility"
              value={formData.responsibility}
              onChange={handleChange}
              placeholder="responsibility"
              required
            />
            <Textarea
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              placeholder="Qualification"
              required
            />
            <Textarea
              name="offer"
              value={formData.offer}
              onChange={handleChange}
              placeholder="What you offer"
              required
            />
            <Input
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="Salary"
              required
            />
            <Input
              name="jobNiche"
              value={formData.jobNiche}
              onChange={handleChange}
              placeholder="Job Niche (e.g. Tech, Finance, Healthcare)"
              required
            />
            <Button
              type="submit"
              className="w-full bg-blue-500 text-white hover:bg-blue-600"
            >
              Post Job
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateJob;
