import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    req.id = decoded.userId;
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while authenticating",
      success: false,
      error: error.message,
    });
  }
};
export default isAuthenticated;
// Authorization Middleware
export const isAuthorized = async (req, res, next) => {
  try {
    const user = await User.findById(req.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    if (user.role !== "Recruiter") {
      return res.status(403).json({ message: "Access denied", success: false });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while authorizing",
      success: false,
      error: error.message,
    });
  }
};
