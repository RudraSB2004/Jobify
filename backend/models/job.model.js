import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  jobtype: {
    type: String,
    required: true,
    enum: ["Full-Time", "Part-Time", "Internship"],
  },
  location: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  introduction: {
    type: String,
    required: true,
  },
  responsibility: {
    type: String,
    required: true,
  },
  qualification: {
    type: String,
    required: true,
  },
  offer: {
    type: String,
    required: true,
  },
  jobNiche: {
    type: String,
    required: true,
  },
  salary: {
    type: String,
    required: true,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Job = mongoose.model("Job", jobSchema);
