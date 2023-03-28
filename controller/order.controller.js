import createError from "../utils/createError.js";
import Order from "../Models/order.model.js";
import Stripe from "stripe";
import Gig from "../Models/gig.model.js";

export const confirmPayment = async (req, res, next) => {
  try {
    const order = await Order.findOneAndUpdate(req.body.payment_intent, {
      $set: {
        isCompleted: true,
      },
    });

    res.status(200).send("Order has been confirmed");
  } catch (error) {
    res.status(400).send(error);
  }
};

export const createPaymentIntent = async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET);

  const gig = await Gig.findById(req.params.id);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: gig.price * 100,
    currency: "inr",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  const newOrder = await Order.create({
    gigId: gig._id,
    image: gig.cover,
    title: gig.title,
    price: gig.price,
    sellerId: gig.userId,
    buyerId: req.userId,
    isCompleted: false,
    payment_intent: paymentIntent.id,
  });

  res.status(201).json({
    clientSecret: paymentIntent.client_secret,
  });
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
      isCompleted: true,
    });
    res.status(200).send(orders);
  } catch (error) {
    next(error);
  }
};
