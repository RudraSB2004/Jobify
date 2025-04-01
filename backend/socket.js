import { Server } from "socket.io";
import express from "express";
import http from "http";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

const userSocketMap = {}; // Stores { userId: socketId } mappings

export const getReceiverSocketId = (receiverId) => {
  console.log(`Fetching socket ID for receiver: ${receiverId}`);
  return userSocketMap[receiverId] || null;
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`✅ User Connected: ${userId} | Socket ID: ${socket.id}`);
  }

  // Send updated online users list to all clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    if (userId && userSocketMap[userId]) {
      console.log(`❌ User Disconnected: ${userId} | Socket ID: ${socket.id}`);
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

// Handle message sending
io.on("sendMessage", ({ senderId, receiverId, message }) => {
  const receiverSocketId = getReceiverSocketId(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", { senderId, message });
  } else {
    console.log(`📌 Receiver (${receiverId}) is offline or not connected.`);
  }
});

export { app, server, io };
