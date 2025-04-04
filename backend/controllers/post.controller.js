import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/posts.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";

export const addNewPost = async (req, res) => {
  try {
    const { title } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) return res.status(400).json({ message: "Image required" });
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();
    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;
    try {
      const cloudResponse = await cloudinary.uploader.upload(fileUri);
      const post = await Post.create({
        title,
        image: cloudResponse.secure_url,
        author: authorId,
      });
      const user = await User.findById(authorId);
      if (user) {
        user.posts.push(post._id);
        await user.save();
      }
      await post.populate({ path: "author", select: "-password" });

      return res.status(201).json({
        message: "Post created successfully",
        post,
        success: true,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error uploading image" });
    }
  } catch (error) {
    console.error(error);
  }
};

export const getAllPost = async (req, res) => {
  try {
    // Fetch posts, sorted by creation date in descending order
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username profilePicture followers", // Select username, profilePicture, and followers
        populate: {
          path: "followers", // Populate the followers field
          select: "username profilePicture", // Select username and profilePicture of followers
        },
      })
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } }, // Sort comments by creation date in descending order
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });

    // Respond with the posts and success status
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching posts:", error.message);

    // Respond with an error message
    return res.status(500).json({
      message: "Failed to retrieve posts",
      success: false,
      error: error.message,
    });
  }
};

export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ cratedAt: -1 })
      .populate({
        path: "author",
        select: "username profilePicture",
      })
      .populate({
        path: "comments",
        sort: { cratedAt: -1 },
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const likePost = async (req, res) => {
  try {
    const likeByUser = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "post not found", success: false });

    await post.updateOne({ $addToSet: { likes: likeByUser } });
    await post.save();

    return res.status(200).json({ message: "Post liked", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const dislikePost = async (req, res) => {
  try {
    const dislikeByUser = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "post not found", success: false });
    await post.updateOne({ $pull: { likes: dislikeByUser } });
    await post.save();

    return res.status(200).json({ message: "Post disliked", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentedById = req.id;

    const { text } = req.body;
    const post = await Post.findById(postId);

    if (!text)
      return res
        .status(400)
        .json({ message: "text is required", success: false });

    const comment = await Comment.create({
      text,
      author: commentedById,
      post: postId,
    });
    await comment.populate({
      path: "author",
      select: "username profilePicture",
    });

    post.comments.push(comment._id);
    await post.save();
    return res.status(200).json({
      success: true,
      message: "Comment created",
      comment,
    });
  } catch (error) {
    console.log(error);
  }
};
export const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ post: postId }).populate(
      "author",
      "username profilePicture"
    );
    if (!comments)
      return res
        .status(400)
        .json({ message: "No Comment found for this post", success: false });
    return res
      .status(200)
      .json({ success: true, message: "Comments fetched", comments });
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(400)
        .json({ message: "Post not found", success: false });
    if (post.author.toString() !== authorId)
      return res.status(400).json({ message: "UnAuthorised" });

    //deletepost
    if (post.image) {
      const publicId = post.image.split("/").pop().split(".")[0]; // Extract public_id from URL
      await cloudinary.uploader.destroy(publicId);
    }
    await Post.findByIdAndDelete(postId);

    //remove comments of the post and from user
    let user = await User.findById(authorId);
    user.posts = user.posts.filter((id) => id.toString() !== postId);
    await user.save();

    await Comment.deleteMany({ post: postId });
    return res.status(200).json({ success: true, message: "Post deleted" });
  } catch (error) {
    console.log(error);
  }
};

export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.id;
    const post = await Post.findById(postId);
    if (!post)
      return res.status(400).json({
        success: false,
        message: "Post not found",
      });
    const user = await User.findById(userId);
    if (user.bookmarks.includes(postId)) {
      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({
        type: "Bookmark removed",
        message: "Post removed from bookmark",
        success: true,
      });
    } else {
      await user.updateOne({ $push: { bookmarks: post._id } });
      await user.save();
      return res
        .status(200)
        .json({ success: true, type: "saved", message: "Post bookmarked" });
    }
  } catch (error) {
    console.log(error);
  }
};
