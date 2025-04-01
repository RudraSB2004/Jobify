import React from "react";
import {
  FaRegBuilding,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFileAlt,
} from "react-icons/fa";
import OpenImageInNewTab from "../lib/OpenImageInNewTab";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AppliedJobs = ({ application }) => {
  return (
    <Card className="w-auto h-auto bg-stone-200 shadow-md border border-gray-300">
      <CardHeader className="text-xl font-semibold text-gray-800">
        Job Application Details
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Job Details */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Job Details
            </h2>
            <p className="flex items-center text-sm text-gray-600">
              <FaFileAlt className="mr-2 text-gray-500" /> Job Title:
              <span className="ml-2 font-medium">
                {application.jobInfo.jobTitle}
              </span>
            </p>
            <p className="flex items-center text-sm text-gray-600">
              <FaRegBuilding className="mr-2 text-gray-500" /> Company Name:
              <span className="ml-2 font-medium">
                {application.jobInfo.jobId.companyName}
              </span>
            </p>
            <p className="flex items-center text-sm text-gray-600">
              <FaFileAlt className="mr-2 text-gray-500" /> Offer:
              <span className="ml-2 font-medium">
                {application.jobInfo.jobId.offer}
              </span>
            </p>
            <p className="flex items-center text-sm text-gray-600">
              <FaFileAlt className="mr-2 text-gray-500" /> Job Niche:
              <span className="ml-2 font-medium">
                {application.jobInfo.jobId.jobNiche}
              </span>
            </p>
          </div>

          {/* Applicant Details */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Applicant Details
            </h2>
            <p className="flex items-center text-sm text-gray-600">
              <FaUser className="mr-2 text-gray-500" /> Username:
              <span className="ml-2 font-medium">
                {application.jobSeekerInfo.username}
              </span>
            </p>
            <p className="flex items-center text-sm text-gray-600">
              <FaEnvelope className="mr-2 text-gray-500" /> Email:
              <span className="ml-2 font-medium">
                {application.jobSeekerInfo.email}
              </span>
            </p>
            <p className="flex items-center text-sm text-gray-600">
              <FaPhone className="mr-2 text-gray-500" /> Phone:
              <span className="ml-2 font-medium">
                {application.jobSeekerInfo.phone}
              </span>
            </p>
            <p className="flex items-center text-sm text-gray-600">
              <FaMapMarkerAlt className="mr-2 text-gray-500" /> Address:
              <span className="ml-2 font-medium">
                {application.jobSeekerInfo.address}
              </span>
            </p>
            {application.jobSeekerInfo.resume && (
              <Button
                variant="link"
                className="mt-4 text-blue-600 hover:text-blue-400"
              >
                <FaFileAlt className="mr-2" />
                <OpenImageInNewTab
                  imageUrl={application.jobSeekerInfo.resume}
                />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppliedJobs;
