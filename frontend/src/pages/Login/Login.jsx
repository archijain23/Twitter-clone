import React from "react";
import { useState } from "react";

import x from "../../assets/images/x.png";
import XIcon from "@mui/icons-material/X";
import { Link, useNavigate } from "react-router-dom";
import GoogleButton from "react-google-button";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import auth from "../../firebase.init";
import "./login.css";
import LanguageSelector from "../language/language-selector";
import { useTranslation } from "react-i18next";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setError] = useState("");
  const { t } = useTranslation();

  const navigate = useNavigate();
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const [signInWithGoogle, googleUser, googleLoading, googleError] =
    useSignInWithGoogle(auth);

  console.log(user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(email, password);
    signInWithEmailAndPassword(email, password);
    await axios.patch(`http://localhost:5000/userUpdates/${email}`, {
      email: email,
    });
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      if (result.user) {
        await sendUserDataToBackend(result.user);
      }
    } catch (error) {
      console.error("Error during Google sign-in:", error);
    }
  };

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
        username: user.email.split("@")[0],
        name: user.displayName || "Google User",
        email: user.email,
        photoURL: user.photoURL,
        firebaseUid: user.uid,
      };
      console.log("Sending user data to backend:", userData);

      const response = await axios.post(
        "http://localhost:5000/register",
        userData
      );
      console.log("Full response from backend:", response);
      console.log("Response data from backend:", response.data);

      return response.data;
    } catch (error) {
      console.error("Error sending user data to backend:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      throw error;
    }
  };
  return (
    <div className="login-container">
      <div className="image-container">
        <img src={x} alt="twitterLogo" className="image" />
      </div>
      <div className="form-container">
        <XIcon className="Twittericon" />

        <h2 className="heading">{t("Happening now")}</h2>
        <h3 className="heading1">{t("Join Twitter today.")}</h3>
        <form onSubmit={handleSubmit} className="form-box">
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
              {t("Log in")}
            </button>
          </div>

          <div className="google-button">
            <GoogleButton
              className="g-button"
              type="light"
              onClick={handleGoogleSignIn}
            />
          </div>
          <div>
            {t(" Don't have an account?")}
            <Link
              to="/signup"
              style={{
                textDecoration: "none",
                color: "skyblue",
                fontWeight: "600",
                marginLeft: "5px",
              }}
            >
              {t("Signup")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
