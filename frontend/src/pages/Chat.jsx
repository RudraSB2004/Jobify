import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useGetAllMessage from "../hooks/useGetAllMessages";
import { setMessages } from "../redux/chatSlice";
import { setSelectedUser } from "../redux/authSlice";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import Navbar from "../components/Navbar";
import { Avatar } from "@/components/ui/avatar";
import { io } from "socket.io-client";

const ChatHeader = ({ selectedUser }) => (
  <div className="p-4 border-b bg-black text-white text-lg font-semibold">
    Chat with {selectedUser?.username || "Unknown"}
  </div>
);

const MessageList = ({ messages, user }) => {
  return (
    <div className="p-4 space-y-2 h-100% overflow-y-auto scrollbar-hide">
      {messages.map((msg) => (
        <div
          key={msg._id}
          className={`p-2 max-w-xs flex ${
            msg.receiverId === user._id
              ? "bg-gray-800 text-white" // Received messages
              : "bg-blue-500 text-white ml-auto self-end" // Sent messages
          } rounded-lg`}
        >
          <span>{msg.message}</span> {/* Message text */}
          <span className="text-xs text-gray-400 mt-1 ml-2">
            {new Date(msg.createdAt).toLocaleString()} {/* Timestamp */}
          </span>
        </div>
      ))}
    </div>
  );
};

const UserList = ({ suggestedUsers = [], onlineUsers = [], onSelectUser }) => (
  <div className="space-y-2">
    {suggestedUsers.length > 0 ? (
      suggestedUsers.map((user) => (
        <div
          key={user._id}
          className="p-2 cursor-pointer hover:bg-gray-700 rounded-lg flex items-center gap-2 text-white"
          onClick={() => onSelectUser(user)}
        >
          <Avatar
            src={user.profilePicture}
            alt={user.username}
            className="w-8 h-8 rounded-full bg-white"
            fallback="/default-avatar.png"
          />
          {user.username || "Unknown User"}
          {/* Online indicator */}
          {onlineUsers.includes(user._id) && (
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
          )}
        </div>
      ))
    ) : (
      <div className="text-gray-500">No users available</div>
    )}
  </div>
);

const ChatMain = () => {
  const [textMessage, setTextMessage] = useState("");
  const { user, selectedUser, suggestedUsers } = useSelector(
    (store) => store.auth
  );
  const { onlineUsers, messages } = useSelector((store) => store.chat);
  const dispatch = useDispatch();

  // Get all messages initially
  useGetAllMessage();

  useEffect(() => {
    if (!selectedUser?._id) return;

    // Set up real-time socket connection here for live updates
    const socket = io(`${import.meta.env.VITE_BACKEND_URL}`, {
      query: { userId: user._id },
      transports: ["websocket"],
    });

    socket.on("receiveMessage", (newMessage) => {
      // Add the new message when received
      dispatch(setMessages((prevMessages) => [...prevMessages, newMessage]));
    });

    return () => socket.close(); // Close socket when component unmounts
  }, [selectedUser, user._id, dispatch]);

  const sendMessageHandler = async () => {
    if (!textMessage.trim()) return;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/message/send/${selectedUser?._id}`,
        { textMessage },
        { withCredentials: true }
      );
      if (response.data.success) {
        // Optimistically update the UI by adding the new message
        dispatch(setMessages([...messages, response.data.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  useEffect(() => {
    return () => dispatch(setSelectedUser(null)); // Reset selected user on unmount
  }, [dispatch]);

  return (
    <div className="flex h-screen overflow-hidden bg-black text-white">
      <Navbar />
      {/* User List Sidebar */}
      <Card className="w-1/4 h-full bg-gray-900 p-4 mt-16 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Chats</h2>
        <ScrollArea className="h-[calc(100vh-6rem)]">
          <UserList
            suggestedUsers={suggestedUsers}
            onlineUsers={onlineUsers}
            onSelectUser={(user) => dispatch(setSelectedUser(user))}
          />
        </ScrollArea>
      </Card>

      {/* Chat Section */}
      <Card className="flex flex-col w-3/4 h-full bg-gray-800 mt-10 border shadow-md">
        {selectedUser ? (
          <>
            <ChatHeader selectedUser={selectedUser} />
            {/* Message List Section */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
              <MessageList messages={messages} user={user} />
            </div>
            {/* Input Section */}
            <div className="p-2 border-t flex gap-2 w-full min-h-[48px] bg-gray-900 box-border mb-5">
              <Input
                placeholder="Type a message..."
                value={textMessage}
                onChange={(e) => setTextMessage(e.target.value)}
                className="flex-1 w-full bg-gray-700 text-white placeholder-gray-400 p-2"
              />
              <Button
                onClick={sendMessageHandler}
                disabled={!textMessage.trim()}
                className="bg-white text-black"
              >
                Send
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-center p-6">
            <span className="text-gray-400">
              Select a user to start a conversation
            </span>
            <Button className="mt-4 bg-white text-black">Find Users</Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ChatMain;
