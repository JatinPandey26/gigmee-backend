import express from "express";
import {
  getOrders,
  createPaymentIntent,
  confirmPayment
} from "../controller/order.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

// router.post("/:gigId",verifyToken,createOrder);
router.post("/", verifyToken, getOrders);
router.post("/create-payment-intent/:id", verifyToken, createPaymentIntent);
router.put("/", verifyToken, confirmPayment);
export { router as orderRouter };
