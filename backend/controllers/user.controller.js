import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/posts.model.js";

export const register = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Something is missing, please check!",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "Email already exists",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({
      message: "User created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Something is missing, please check!",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Email not found",
        success: false,
      });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(400).json({
        message: "Invalid password",
        success: false,
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Populate posts only if necessary
    const populatedPosts = (
      await Promise.all(
        user.posts.map(async (postId) => {
          const post = await Post.findById(postId);
          return post?.author.equals(user._id) ? post : null;
        })
      )
    ).filter(Boolean); // Removes null values

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: populatedPosts,
      phone: user.phone,
      bookmarks: user.bookmarks,
      resume: user.resume,
      role: user.role,
      banner: user.banner,
    };
    console.log(token);
    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "Lax", // Allow cross-site requests
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .json({ message: `Welcome back`, success: true, user });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

export const logout = async (req, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};
export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password").populate({
      path: "posts",
      createdAt: -1,
    });
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { username, phone, role, bio } = req.body;
    const user = await User.findById(userId).select("-password");
    const profilePicture = req.file;
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    if (profilePicture) {
      if (user.profilePicture) {
        const oldImagePublicId = user.profilePicture
          .split("/")
          .pop()
          .split(".")[0];
        await cloudinary.uploader.destroy(oldImagePublicId);
      }
      const fileUri = getDataUri(profilePicture);
      const cloudResponse = await cloudinary.uploader.upload(fileUri);
      user.profilePicture = cloudResponse.secure_url;
    }

    if (username) user.username = username;
    if (phone) user.phone = phone;
    if (role) user.role = role;
    if (bio) user.bio = bio;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select(
      "-password"
    );
    if (!suggestedUsers) {
      return res.status(404).json({
        message: "No suggested users found",
        success: false,
      });
    }
    res.status(200).json({
      message: "Suggested users found",
      success: true,
      suggestedUsers,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

export const followOrUnfollow = async (req, res) => {
  try {
    const whoWantsToFollow = req.id;
    const whomToFollow = req.params.id;

    if (whoWantsToFollow === whomToFollow) {
      return res.status(400).json({
        message: "You can't follow yourself",
        success: false,
      });
    }
    const [targetedUser, user] = await Promise.all([
      User.findById(whomToFollow),
      User.findById(whoWantsToFollow),
    ]);
    if (!targetedUser || !user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    const isFollowing = user.following.includes(whomToFollow);

    if (isFollowing) {
      await Promise.all([
        user.updateOne({ $pull: { following: whomToFollow } }),
        targetedUser.updateOne({ $pull: { followers: whoWantsToFollow } }),
      ]);
    } else {
      await Promise.all([
        user.updateOne({ $push: { following: whomToFollow } }),
        targetedUser.updateOne({ $push: { followers: whoWantsToFollow } }),
      ]);
    }
    return res.status(200).json({
      message: isFollowing
        ? "Unfollowed successfully"
        : "Followed successfully",
      success: true,
      followers: targetedUser.followers,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

export const editBanner = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId).select("-password");
    const banner = req.file;
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    if (banner) {
      if (user.banner) {
        const oldImagePublicId = user.banner.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(oldImagePublicId);
      }
      const fileUri = getDataUri(banner);
      const cloudResponse = await cloudinary.uploader.upload(fileUri);
      user.banner = cloudResponse.secure_url;
    }
    await user.save();

    res.status(200).json({
      message: "Banner updated successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};
export const uploadResume = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId).select("-password");
    const resume = req.file;
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    if (resume) {
      if (user.resume) {
        const oldImagePublicId = user.resume.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(oldImagePublicId);
      }
      const fileUri = getDataUri(resume);
      const cloudResponse = await cloudinary.uploader.upload(fileUri);
      user.resume = cloudResponse.secure_url;
    }
    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({
        message: "Search query is required",
        success: false,
      });
    }
    const users = await User.find(
      { username: { $regex: query, $options: "i" } },
      "_id username profilePicture"
    );

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};
