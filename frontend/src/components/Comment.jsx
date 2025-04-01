import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Comment = ({ comment }) => {
  return (
    <div className="flex gap-3 items-start p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
      {/* Author Profile Picture using ShadCN Avatar */}
      <Avatar className="w-8 h-8">
        <AvatarImage
          src={
            comment?.author?.profilePicture || "https://github.com/shadcn.png"
          }
          alt={comment?.author?.username}
        />
        <AvatarFallback>
          {comment?.author?.username?.charAt(0) || "U"}
        </AvatarFallback>
      </Avatar>

      {/* Comment Content */}
      <div className="flex flex-col">
        <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">
          {comment?.author?.username}
        </span>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {comment?.text}
        </p>
      </div>
    </div>
  );
};

export default Comment;
