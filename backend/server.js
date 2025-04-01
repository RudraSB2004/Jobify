import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import applicationRouter from "./routes/application.router.js";
import jobRouter from "./routes/job.router.js";
import postRouter from "./routes/post.router.js";
import messageRouter from "./routes/message.route.js";

dotenv.config({});
import { server, app } from "./socket.js";

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  })
);

const PORT = process.env.PORT || 3000;

connectDB();
app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);
app.use("/api/v1/message", messageRouter);
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
