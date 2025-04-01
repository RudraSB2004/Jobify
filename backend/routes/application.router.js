import express from "express";
import isAuthendicated, {
  isAuthorized,
} from "../middlewares/isAuthenticated.js";
import {
  employerGetAllApplication,
  jobSeekerGetAllApplication,
  postApplication,
} from "../controllers/application.controller.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.route("/post/:id").post(isAuthendicated, postApplication);
router
  .route("/employer/getall")
  .get(isAuthendicated, employerGetAllApplication);
router
  .route("/jobseeker/getall")
  .get(isAuthendicated, jobSeekerGetAllApplication);

export default router;
