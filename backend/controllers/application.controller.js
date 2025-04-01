import { Application } from "../models/application.model.js";
import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";
import cloudinary from "../utils/cloudinary.js";
import sharp from "sharp";

export const postApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, phone, address } = req.body;
    if (!username || !email || !phone || !address) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    const jobDetails = await Job.findById(id);
    if (!jobDetails) {
      return res.status(404).json({ message: "Job not found" });
    }
    const isAlreadyApplied = await Application.findOne({
      "jobInfo.jobId": id,
      "jobSeekerInfo.id": req.id,
    });
    if (isAlreadyApplied) {
      return res.status(400).json({
        message: "You have already applied for this job",
        success: false,
      });
    }
    const jobSeekerInfo = {
      id: req.id,
      username,
      email,
      phone,
      address,
    };
    if (req.file) {
      const resume = req.file;
      const optimizedImageBuffer = await sharp(resume.buffer)
        .resize({ width: 800, height: 800, fit: "inside" })
        .toFormat("jpeg", { quality: 80 })
        .toBuffer();
      const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
        "base64"
      )}`;
      try {
        const cloudResponse = await cloudinary.uploader.upload(fileUri);
        jobSeekerInfo.resume = cloudResponse.secure_url;
      } catch (error) {}
    }
    const employerInfo = {
      id: jobDetails.postedBy,
      role: "Recruiter",
    };
    const jobInfo = {
      jobId: id,
      jobTitle: jobDetails.title,
    };

    const application = await Application.create({
      jobSeekerInfo,
      employerInfo,
      jobInfo,
    });
    return res.status(200).json({
      message: "Application submitted successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
    console.error(error);
  }
};

export const employerGetAllApplication = async (req, res) => {
  try {
    const employerId = req.id; // Ensure `req.user.id` is available
    if (!employerId) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const applications = await Application.find({
      "employerInfo.id": employerId,
      "deletedBy.recruiter": false,
    }).populate("jobInfo.jobId");

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const jobSeekerGetAllApplication = async (req, res) => {
  try {
    const id = req.id;
    const application = await Application.find({
      "jobSeekerInfo.id": id,
      "deletedBy.jobSeeker": false,
    }).populate("jobInfo.jobId");
    return res.status(200).json({
      success: true,
      application,
      message: " Found all application you applied for",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
    console.log(error);
  }
};
