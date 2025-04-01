import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId, // Fixed type
      ref: "User",
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId, // Fixed type
      ref: "User",
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
); // Adds createdAt and updatedAt timestamps

export const Message = mongoose.model("Message", messageSchema);
