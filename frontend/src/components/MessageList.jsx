import React from "react";
import { Card } from "@/components/ui/card";

const MessageList = ({ messages, user, selectedUser }) => {
  // Filtering messages to include only those relevant to the selected chat
  const filteredMessages = messages.filter(
    (message) =>
      message.senderId === selectedUser._id ||
      message.receiverId === selectedUser._id
  );

  return (
    <Card className="flex-grow p-4 overflow-y-auto bg-background shadow-sm border">
      {filteredMessages.length > 0 ? (
        filteredMessages.map((message) => {
          const isSender = message.senderId === user._id;

          return (
            <div
              key={message._id}
              className={`flex ${
                isSender ? "justify-end" : "justify-start"
              } mb-4`}
            >
              {!isSender && (
                <img
                  src={
                    selectedUser?.profilePicture ||
                    "https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg"
                  }
                  alt={selectedUser.username}
                  className="w-7 h-7 rounded-full mr-2"
                />
              )}
              <div
                className={`p-3 rounded-lg shadow-sm border max-w-xs text-sm ${
                  isSender
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {message.message}
              </div>
              {isSender && (
                <img
                  src={user?.profilePicture}
                  alt={user?.username}
                  className="w-7 h-7 rounded-full ml-2"
                  style={{ visibility: "hidden" }}
                />
              )}
            </div>
          );
        })
      ) : (
        <div className="text-muted-foreground text-center p-4">
          No messages to display
        </div>
      )}
    </Card>
  );
};

export default MessageList;
