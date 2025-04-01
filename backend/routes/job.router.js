import express from "express";
import isAuthenticated, {
  isAuthorized,
} from "../middlewares/isAuthenticated.js";
import {
  postJob,
  getAllJobs,
  getAsingleJob,
  getMyJobs,
  deleteJob,
} from "../controllers/job.controller.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, postJob);
router.route("/all").get(getAllJobs);
router.route("/getmyjobs").get(isAuthenticated, getMyJobs);
router.route("/delete/:id").delete(isAuthenticated, deleteJob);
router.route("/get/:id").get(getAsingleJob);

export default router;
