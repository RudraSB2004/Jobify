import React from "react";
import { Card } from "@/components/ui/card";

const ChatHeader = ({ selectedUser }) => (
  <Card className="flex items-center p-4 bg-background shadow w-full border-b">
    {selectedUser && selectedUser.profilePicture ? (
      <img
        src={selectedUser.profilePicture}
        alt={selectedUser.username}
        className="w-10 h-10 rounded-full mr-4"
      />
    ) : (
      <img
        className="w-10 h-10 rounded-full mr-4"
        src="https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg"
        alt="Default Avatar"
      />
    )}
    <div className="text-lg font-semibold text-primary">
      {selectedUser?.username}
    </div>
  </Card>
);

export default ChatHeader;
