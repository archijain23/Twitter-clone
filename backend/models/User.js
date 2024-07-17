import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
  type: String,
  browser: String,
  os: String,
  ip: String,
  lastLogin: Date,
  isVerified: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema({
  // Existing fields
  email: String,
  name: String,
  username: String,
  firebaseUid: String,
  photoURL: String,
  subscription: Object,
  // New fields
  devices: [deviceSchema],
  otpEnabled: { type: Boolean, default: false },
  mobileAccessExpiry: Date,
});

export default mongoose.model("User", userSchema);
