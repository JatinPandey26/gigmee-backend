import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

import { userRouter } from "./routes/user.route.js";
import { gigRouter } from "./routes/gig.route.js";
import { orderRouter } from "./routes/order.route.js";
import { conversationRouter } from "./routes/conversation.route.js";
import { messageRouter } from "./routes/message.route.js";
import { reviewRouter } from "./routes/review.route.js";
import { authRouter } from "./routes/auth.route.js";

const app = express();
dotenv.config({
  path: "./.env",
});

mongoose.set("strictQuery", true);

try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("connected to database");
} catch (error) {
  console.log(error);
}

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin:process.env.FRONTEND_URL,
  credentials:true
}));

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/gigs", gigRouter);
app.use("/api/orders", orderRouter);
app.use("/api/conversations", conversationRouter);
app.use("/api/messages", messageRouter);
app.use("/api/reviews", reviewRouter);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Internal Server Error";

  return res.status(errorStatus).send(errorMessage);
});

app.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
});
