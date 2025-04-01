import React from "react";
import { Card } from "@/components/ui/card";
import { FaUserCircle } from "react-icons/fa";

const UserList = ({ suggestedUsers, onlineUsers, onSelectUser }) => (
  <Card className="flex flex-col space-y-4 p-4 bg-background shadow-sm border">
    {suggestedUsers.map((suggestedUser) => {
      const isOnline = onlineUsers.includes(suggestedUser?._id);
      return (
        <div
          key={suggestedUser._id}
          onClick={() => onSelectUser(suggestedUser)}
          className="flex items-center p-3 hover:bg-muted rounded-lg cursor-pointer gap-3 transition-colors"
        >
          {suggestedUser?.profilePicture ? (
            <img
              src={suggestedUser.profilePicture}
              className="w-10 h-10 rounded-full border"
              alt="Profile"
            />
          ) : (
            <FaUserCircle className="w-10 h-10 text-muted-foreground" />
          )}
          <div className="flex flex-col">
            <span className="font-medium text-sm text-foreground">
              {suggestedUser?.username}
            </span>
            {isOnline && <span className="text-xs text-green-500">Online</span>}
          </div>
        </div>
      );
    })}
  </Card>
);

export default UserList;
