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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setError] = useState("");

  const navigate = useNavigate();
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const [signInWithGoogle, googleUser, googleLoading, googleError] =
    useSignInWithGoogle(auth);

  console.log(user);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);
    signInWithEmailAndPassword(email, password);
  };

  const handleGoogleSignIn = () => {
    signInWithGoogle();
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

  return (
    <div className="login-container">
      <div className="image-container">
        <img src={x} alt="twitterLogo" className="image" />
      </div>
      <div className="form-container">
        <XIcon className="Twittericon" />
        <h2 className="heading">Happening now</h2>
        <h3 className="heading1">Join Twitter today.</h3>
        <form onSubmit={handleSubmit} className="form-box">
          <input
            type="email"
            className="display-name"
            placeholder="email address"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            type="password"
            className="display-name"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <div className="btn-login">
            <button type="submit" className="btn">
              Log in
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
            Don't have an account?
            <Link
              to="/signup"
              style={{
                textDecoration: "none",
                color: "skyblue",
                fontWeight: "600",
                marginLeft: "5px",
              }}
            >
              Signup
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
