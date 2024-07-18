import LanguageIcon from "@mui/icons-material/Language";
import { Modal } from "@mui/material";
import { useState } from "react";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import "./language-selector.css";
import { useTranslation } from "react-i18next";
import axios from "axios";
import OTPModal from "../otpComponent/otp.jsx";

import useLoggedInUser from "../../hooks/useLoggedInUser.js";

const languages = [
  { code: "en", lang: "English" },
  { code: "fr", lang: "French" },
  { code: "bn", lang: "Bengali" },
  { code: "ta", lang: "Tamil" },
  { code: "pt", lang: "Portuguese" },
  { code: "hi", lang: "Hindi" },
  { code: "es", lang: "Spanish" },
];

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  height: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 8,
  backgroundColor: "rgb(83, 85, 85)",
};

export default function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const { i18n } = useTranslation();
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [pendingLanguage, setPendingLanguage] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const loggedInUser = useLoggedInUser();

  const handleClose = () => {
    setOpen(false);
  };

  const changeLanguage = async (lang) => {
    setPendingLanguage(lang);
    setOpen(false); // This will close the language selection modal

    const email = loggedInUser[0]?.email;
    if (email) {
      setUserEmail(email);
      try {
        const response = await axios.post(
          "https://twitter-clone-xylb.onrender.com//api/otp/generate",
          { email }
        );
        if (response.data.success) {
          setIsOTPModalOpen(true);
        } else {
          alert("Failed to send OTP. Please try again.");
        }
      } catch (error) {
        console.error("Error generating OTP:", error);
        alert("Error generating OTP. Please try again.");
      }
    } else {
      alert("User email not found. Please make sure you're logged in.");
    }
  };

  const handleOTPVerify = async (inputOTP) => {
    console.log("Verifying OTP for email:", userEmail);
    const response = await axios.post(
      "https://twitter-clone-xylb.onrender.com//api/otp/verify",
      {
        email: userEmail,
        otp: inputOTP,
      }
    );
    if (response.data.success) {
      i18n.changeLanguage(pendingLanguage);
      setIsOTPModalOpen(false);
      setPendingLanguage(null);
      setUserEmail("");
    } else {
      alert(response.data.message);
    }
  };

  return (
    <div className="language-selector">
      <button
        onClick={() => {
          setOpen(true);
        }}
      >
        <LanguageIcon />
      </button>

      <Modal
        hideBackdrop
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={style}>
          <IconButton
            onClick={() => {
              setOpen(false);
            }}
          >
            <CloseIcon className="closeIcon" />
          </IconButton>
          <div className="lang-btns">
            {languages.map((lng) => (
              <button
                className={`lang-btn ${
                  lng.code === i18n.language ? "selected" : ""
                }`}
                key={lng.code}
                onClick={() => changeLanguage(lng.code)}
              >
                {lng.lang}
              </button>
            ))}
          </div>
        </Box>
      </Modal>
      <OTPModal
        isOpen={isOTPModalOpen}
        onClose={() => setIsOTPModalOpen(false)}
        onVerify={handleOTPVerify}
      />
    </div>
  );
}
