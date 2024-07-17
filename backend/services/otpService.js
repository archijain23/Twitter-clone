// // services/otpService.js
// let otp = null;

// export const generateOTP = () => {
//   otp = Math.floor(100000 + Math.random() * 900000).toString();
//   // In a real scenario, you'd send this OTP to the user's email or phone
//   console.log("Generated OTP:", otp);
//   return otp;
// };

// export const verifyOTP = (inputOTP) => {
//   return inputOTP === otp;
// };

// services/otpService.js
import { sendOTPEmail } from "./emailService.js";

let otpStore = new Map(); // Store OTPs with email as key

export const generateOTP = async (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await sendOTPEmail(email, otp);
    otpStore.set(email, {
      otp: otp,
      createdAt: Date.now(),
    });
    return true; // OTP sent successfully
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return false; // Failed to send OTP
  }
};

export const verifyOTP = (email, inputOTP) => {
  const storedOTPData = otpStore.get(email);
  if (!storedOTPData) return false;

  const { otp, createdAt } = storedOTPData;
  const now = Date.now();
  const tenMinutes = 10 * 60 * 1000;

  if (now - createdAt > tenMinutes) {
    otpStore.delete(email); // Remove expired OTP
    return false;
  }

  if (inputOTP === otp) {
    otpStore.delete(email); // Remove used OTP
    return true;
  }

  return false;
};
