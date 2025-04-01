import express from "express";
import {
  editBanner,
  editProfile,
  followOrUnfollow,
  getProfile,
  getSuggestedUsers,
  login,
  logout,
  register,
  uploadResume,
  searchUsers,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router
  .route("/profile/edit")
  .post(isAuthenticated, upload.single("profilePicture"), editProfile);
router
  .route("/profile/banner")
  .post(isAuthenticated, upload.single("banner"), editBanner);
router.route("/suggested").get(isAuthenticated, getSuggestedUsers);
router.route("/:id/profile").get(isAuthenticated, getProfile);
router.route("/followorUnfollow/:id").post(isAuthenticated, followOrUnfollow);
router
  .route("/upload-resume")
  .post(isAuthenticated, upload.single("resume"), uploadResume);
router.route("/search").get(searchUsers);
export default router;
