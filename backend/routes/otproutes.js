// backend/routes/otpRoutes.js
import express from "express";
import { sendOTPEmail } from "../services/emailService.js";

const router = express.Router();

const otpStore = new Map();

router.post("/generate", async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    const success = await sendOTPEmail(email, otp);
    if (success) {
      otpStore.set(email, {
        otp: otp,
        createdAt: Date.now(),
      });
      res.json({ success: true, message: "OTP sent successfully" });
    } else {
      res.status(500).json({ success: false, message: "Failed to send OTP" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error generating OTP" });
  }
});

router.post("/verify", (req, res) => {
  const { email, otp } = req.body;
  const storedOTPData = otpStore.get(email);

  if (!storedOTPData) {
    return res.json({ success: false, message: "Invalid OTP" });
  }

  const { otp: storedOTP, createdAt } = storedOTPData;
  const now = Date.now();
  const tenMinutes = 10 * 60 * 1000;

  if (now - createdAt > tenMinutes) {
    otpStore.delete(email);
    return res.json({ success: false, message: "OTP expired" });
  }

  if (otp == storedOTP) {
    otpStore.delete(email);
    return res.json({ success: true, message: "OTP verified successfully" });
  }

  res.json({ success: false, message: "Invalid OTP" });
});

export default router;
