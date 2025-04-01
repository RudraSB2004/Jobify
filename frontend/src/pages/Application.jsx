import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const Application = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigateTo = useNavigate();
  const { selectedJob } = useSelector((store) => store.job);
  const { id } = useParams();

  const handlePostApplication = async (e) => {
    e.preventDefault();

    if (!selectedJob) {
      toast.error("No job selected.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("resume", resume);
    formData.append("jobId", selectedJob._id);

    const token = localStorage.getItem("token"); // Ensure token is included

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/application/post/${id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setTimeout(() => navigateTo("/jobs"), 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      console.log("Error:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10 min-w-screen">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Application Form */}
        <Card className="w-full shadow-md rounded-lg border border-gray-300 bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Apply for {selectedJob?.title || "Job"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePostApplication} className="space-y-6">
              <div>
                <Label htmlFor="username" className="text-gray-700">
                  Full Name
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your full name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-gray-700">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="text"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="address" className="text-gray-700">
                  Address
                </Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Enter your address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="resume" className="text-gray-700">
                  Resume
                </Label>
                <Input
                  id="resume"
                  type="file"
                  onChange={(e) => setResume(e.target.files[0])}
                  required
                />
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-2 rounded-md"
                >
                  {loading ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Job Details Section */}
        {selectedJob && (
          <Card className="w-full shadow-md rounded-lg border border-gray-300 bg-white">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800">
                Job Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-800">
              <p>
                <strong>Company:</strong> {selectedJob.companyName}
              </p>
              <p>
                <strong>Location:</strong> {selectedJob.location}
              </p>
              <p>
                <strong>Type:</strong> {selectedJob.jobtype}
              </p>
              <p>
                <strong>Salary:</strong> {selectedJob.salary}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Application;
