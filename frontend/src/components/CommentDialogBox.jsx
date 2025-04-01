import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import Comment from "./Comment";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CommentDialogBox = ({ setOpen }) => {
  const [text, setText] = useState("");
  const { selectedPost, post } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (selectedPost) {
      setComments(selectedPost.comments);
    }
  }, [selectedPost]);

  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/post/${selectedPost._id}/comment`,
        { text },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedComments = [...comments, res.data.comment];
        setComments(updatedComments);

        const updatedPostData = post.map((p) =>
          p._id === selectedPost._id ? { ...p, comments: updatedComments } : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Drawer open={true} onOpenChange={setOpen}>
      <DrawerContent className="w-full max-w-lg mx-auto">
        <DrawerHeader>
          <DrawerTitle>Comments</DrawerTitle>
        </DrawerHeader>

        {/* Post Image */}
        {selectedPost?.image && (
          <div className="w-full px-6">
            <img
              src={selectedPost.image}
              alt="Post"
              className="w-full h-60 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Comments List */}
        <div className="px-6 py-2 space-y-4 h-[300px] overflow-y-auto">
          {comments.map((cmt) => (
            <Comment key={cmt._id} comment={cmt} />
          ))}
        </div>

        {/* Comment Input */}
        <div className="p-4 border-t flex items-center gap-3">
          <Input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
          />
          <Button disabled={!text.trim()} onClick={sendMessageHandler}>
            Send
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CommentDialogBox;
