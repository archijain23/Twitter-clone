import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import x from "../../assets/images/x.png";
import XIcon from "@mui/icons-material/X";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import auth from "../../firebase.init";
import GoogleButton from "react-google-button";
import { Link } from "@mui/material";
import "./login.css";
import axios from "axios";
import LanguageSelector from "../language/language-selector";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const { t } = useTranslation();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [userInfo, setUserInfo] = useState({});

  const navigate = useNavigate();
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  const [signInWithGoogle, googleUser, googleLoading, googleError] =
    useSignInWithGoogle(auth);

  if (user || googleUser) {
    navigate("/");
    console.log(user);
    console.log(googleUser);
  }
  if (error) {
    console.log(error.message);
  }
  if (loading) {
    console.log("loading...");
  }

  const sendUserDataToBackend = async (user) => {
    try {
      const userData = {
        username: user.email.split("@")[0], // Create a username from email
        name: user.displayName || "Google User",
        email: user.email,
        photoURL: user.photoURL,
        firebaseUid: user.uid,
      };
      const response = await axios.post(
        "https://twitter-clone-xylb.onrender.com/register",
        userData
      );
      console.log("User data sent to backend successfully", response.data);
    } catch (error) {
      console.error("Error sending user data to backend:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        email,
        password
      );
      if (!username || !name || !email || !password) {
        setErrors("Please fill in all fields");
        return;
      }
      if (userCredential.user) {
        const user = {
          username: username,
          name: name,
          email: email,
          firebaseUid: userCredential.user.uid,
          phone: phone,
          browser: userInfo.browser,
          os: userInfo.os,
          device: userInfo.device,
          ip: userInfo.ip,
        };
        const data = await axios.post(
          `https://twitter-clone-xylb.onrender.com/register`,
          user
        );
        console.log(data);
        navigate("/");
      }
    } catch (error) {
      console.error("Error during sign up:", error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      if (result.user) {
        const data = await sendUserDataToBackend(result.user);
        console.log(data);
        navigate("/");
      }
    } catch (error) {
      console.error("Error during Google sign-in:", error);
    }
  };
  return (
    <div className="login-container">
      <div className="image-container">
        <img src={x} alt="twitterLogo" className="image" />
      </div>
      <div className="form-container">
        <XIcon />

        <h2 className="heading">{t("Happening now")}</h2>
        <h3 className="heading1">{t("Join Twitter today.")}</h3>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="display-name"
            placeholder={t("@username")}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <input
            type="text"
            className="display-name"
            placeholder={t(" Enter Full name")}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <input
            type="email"
            className="display-name"
            placeholder={t("email address")}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            type="password"
            className="display-name"
            placeholder={t("Password")}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <div className="btn-login">
            <button type="submit" className="btn">
              {t("Sign up")}
            </button>
          </div>
        </form>
        <hr></hr>
        <div className="google-button">
          <GoogleButton
            className="g-button"
            type="light"
            onClick={handleGoogleSignIn}
          />
        </div>
        <div>
          {t(" Already have an account?")}
          <Link
            to="/login"
            style={{
              textDecoration: "none",
              color: "skyblue",
              fontWeight: 600,
              marginLeft: "5px",
            }}
          >
            {t("Login")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
