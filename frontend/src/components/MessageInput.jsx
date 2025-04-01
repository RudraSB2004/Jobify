import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const MessageInput = ({ textMessage, setTextMessage, sendMessageHandler }) => (
  <div className="mt-4 flex items-center gap-2">
    <Input
      type="text"
      placeholder="Type your message..."
      className="flex-grow"
      value={textMessage}
      onChange={(e) => setTextMessage(e.target.value)}
    />
    <Button onClick={sendMessageHandler} className="bg-primary text-white">
      Send
    </Button>
  </div>
);

export default MessageInput;
