import express from "express";
import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();
import crypto from "crypto";
import Payment from "../models/payment.js";
import { sendReceiptEmail } from "../services/emailService.js";
import { ObjectId } from "mongodb";
import { userCollection } from "../index.js";

const router = express.Router();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

//// ROUTE 1 : Create Order Api Using POST Method http://localhost:5000/api/payment/subscribe
router.post("/subscribe", (req, res) => {
  const { amount } = req.body;

  try {
    const options = {
      amount: Number(amount * 100),
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Something Went Wrong!" });
      }
      res.status(200).json({ data: order });
      console.log(order);
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
    console.log(error);
  }
});

// ROUTE 2 : Create Verify Api Using POST Method http://localhost:5000/api/payment/verify
router.post("/verify", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } =
    req.body;

  // console.log("req.body", req.body);

  try {
    // Create Sign
    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    // Create ExpectedSign
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    // console.log(razorpay_signature === expectedSign);

    // Create isAuthentic
    const isAuthentic = expectedSign === razorpay_signature;

    // Condition
    if (isAuthentic) {
      const payment = new Payment({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      // Save Payment
      await payment.save();

      // Fetch User email and plan details
      const user = await userCollection.findOne({
        _id: new ObjectId(userId),
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const planDetails = {
        name: user.subscription ? user.subscription.plan : "No Plan",
        amount: user.subscription ? user.subscription.amount : 0,
        period: user.subscription ? user.subscription.period : "No Period",
      };

      //send reciept email
      await sendReceiptEmail(user.email, planDetails, {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
      });

      // Send Message
      res.json({
        message: "Payement Successfully",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
    console.log(error);
  }
});
export default router;
