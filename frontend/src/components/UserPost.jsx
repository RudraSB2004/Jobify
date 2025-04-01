import React, { useEffect, useState } from "react";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { FaRegComment, FaRegBookmark, FaBookmark } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPost, setSelectedPost } from "../redux/postSlice";
import CommentDialogBox from "./CommentDialogBox";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";

const UserPost = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [liked, setLiked] = useState(post?.likes?.includes(user?._id));
  const [postLike, setPostLike] = useState(post?.likes?.length);
  const [comment, setComment] = useState(post?.comments);
  const dispatch = useDispatch();

  const likeOrDislike = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/post/${post._id}/${action}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setPostLike(liked ? postLike - 1 : postLike + 1);
        setLiked(!liked);
        const updatedPosts = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPost(updatedPosts));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/post/${post._id}/comment`,
        { text },
        { withCredentials: true }
      );
      if (res.data.success) {
        setComment([...comment, res.data.comment]);
        const updatedPosts = posts.map((p) =>
          p._id === post._id
            ? { ...p, comments: [...p.comments, res.data.comment] }
            : p
        );
        dispatch(setPost(updatedPosts));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className="mt-6 p-6 shadow-lg rounded-lg border border-gray-200">
      {open && <CommentDialogBox setOpen={setOpen} />}
      <div className="flex items-center gap-4 mb-2">
        <div className="flex flex-col">
          <h3 className="font-semibold text-lg">{post.author?.username}</h3>
          {post.author?.badge && (
            <Badge variant="secondary" className="text-xs mt-1">
              {post.author.badge}
            </Badge>
          )}
        </div>
      </div>
      <p className="mt-2 text-gray-700 text-base">{post.title}</p>
      {post.image && (
        <img
          src={post.image}
          alt="Post"
          className="h-[400px] w-full object-cover rounded-md mt-3"
        />
      )}
      <div className="flex justify-between py-4 text-gray-600 border-t mt-4">
        <Button
          variant="ghost"
          onClick={likeOrDislike}
          className="flex items-center gap-1 hover:text-blue-600"
        >
          {liked ? <AiFillLike className="text-blue-600" /> : <AiOutlineLike />}{" "}
          {postLike} Likes
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            dispatch(setSelectedPost(post));
            setOpen(true);
          }}
          className="flex items-center gap-1 hover:text-blue-600"
        >
          <FaRegComment /> Comment
        </Button>
        <Button
          variant="ghost"
          className="flex items-center gap-1 hover:text-blue-600"
        >
          <FaRegBookmark /> Save
        </Button>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <Input
          placeholder="Add a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-grow"
        />
        {text && (
          <Button
            onClick={commentHandler}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Send
          </Button>
        )}
      </div>
    </Card>
  );
};

export default UserPost;
