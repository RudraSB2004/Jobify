import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";

export const postJob = async (req, res) => {
  try {
    const {
      title,
      jobtype,
      location,
      companyName,
      introduction,
      responsibility,
      qualification,
      offer,
      salary,
      jobNiche,
    } = req.body;
    if (
      !title ||
      !jobtype ||
      !location ||
      !companyName ||
      !introduction ||
      !responsibility ||
      !qualification ||
      !offer ||
      !salary ||
      !jobNiche
    ) {
      console.log(
        title,
        jobtype,
        location,
        companyName,
        introduction,
        responsibility,
        qualification,
        offer,
        salary,
        jobNiche
      );
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    const postedBy = req.id;
    const uploader = await User.findById(req.id);
    if (uploader.role !== "Recruiter") {
      return res.status(403).json({
        message: "You are not authorized to post a job",
        success: false,
      });
    }
    const job = await Job.create({
      title,
      jobtype,
      location,
      companyName,
      introduction,
      responsibility,
      qualification,
      offer,
      salary,
      jobNiche,
      postedBy,
    });
    console.log();
    res.status(201).json({
      message: "Job posted successfully",
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findByIdAndDelete(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    return res.status(200).json({
      message: "Job deleted successfully",
      success: true,
      job,
    });
  } catch (error) {
    console.log(error);
  }
};
export const getAsingleJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    return res.status(200).json({
      message: "Job found",
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const getAllJobs = async (req, res) => {
  try {
    const { city, niche, searchKeyword } = req.query;
    const query = {};

    if (city) {
      query.location = city;
    }
    if (niche) {
      query.jobNiche = niche;
    }
    if (searchKeyword) {
      query.$or = [
        { title: { $regex: searchKeyword, $options: "i" } },
        { company: { $regex: searchKeyword, $options: "i" } },
        { introduction: { $regex: searchKeyword, $options: "i" } },
      ];
    }

    const jobs = await Job.find(query);
    res.status(200).json({
      success: true,
      jobs,
      count: jobs.length,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getMyJobs = async (req, res) => {
  try {
    const userId = req.id;
    const myJobs = await Job.find({ postedBy: userId });
    if (!myJobs) {
      return res.status(404).json({ message: "No jobs found" });
    }
    return res.status(200).json({
      success: true,
      message: "Jobs found successfully",
      myJobs,
    });
  } catch (error) {
    console.log(error);
  }
};
