import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    jobSeekerInfo: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        type: String,
      },
      resume: {
        type: String,
      },
    },
    employerInfo: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      role: {
        type: String,
        required: true,
        enum: ["Recruiter"],
      },
    },
    jobInfo: {
      jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true,
      },
      jobTitle: {
        type: String,
        required: true,
      },
    },
    deletedBy: {
      jobSeeker: {
        type: Boolean,
        default: false,
      },
      recruiter: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true }
);

export const Application = mongoose.model("Application", applicationSchema);
