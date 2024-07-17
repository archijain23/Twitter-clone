// In your OTPModal component (../otpComponent/otp.jsx)
import React, { useState } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";
import "./otp.css";
import { useTranslation } from "react-i18next";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",

  transform: "translate(-50%, -50%)",
  width: 400,
  height: 250,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 8,
  backgroundColor: "rgb(83, 85, 85)",
};

const OTPModal = ({ isOpen, onClose, onVerify }) => {
  const [otp, setOTP] = useState("");
  const { t } = useTranslation();

  const handleVerify = () => {
    onVerify(otp);
    setOTP("");
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="otp-modal-title"
      aria-describedby="otp-modal-description"
    >
      <Box sx={style}>
        <h2 id="otp-modal-title">{t("Enter OTP")}</h2>
        <p style={{ marginLeft: "20px", marginTop: "0" }}>
          {t("check your email for OTP")}
        </p>
        <TextField
          value={otp}
          onChange={(e) => setOTP(e.target.value)}
          placeholder="Enter OTP"
          className="otp-input"
        />
        <Button onClick={handleVerify} className="button">
          {t("Verify")}
        </Button>
        <Button onClick={onClose} className="button">
          {t("Cancel")}
        </Button>
      </Box>
    </Modal>
  );
};

export default OTPModal;
