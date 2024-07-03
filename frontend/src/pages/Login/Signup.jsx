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

const Signup = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(email, password);

    const user = {
      username: username,
      name: name,
      email: email,
    };
    const data = axios.post(
      `https://twitter-clone-xylb.onrender.com/register`,
      user
    );
  };

  const handleGoogleSignIn = () => {
    signInWithGoogle();
  };
  return (
    <div className="login-container">
      <div className="image-container">
        <img src={x} alt="twitterLogo" className="image" />
      </div>
      <div className="form-container">
        <XIcon />
        <h2 className="heading">Happening now</h2>
        <h3 className="heading1">Join Twitter today.</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="display-name"
            placeholder="@username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <input
            type="text"
            className="display-name"
            placeholder=" Enter Full name"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
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
              Sign up
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
          Already have an account?
          <Link
            to="/login"
            style={{
              textDecoration: "none",
              color: "skyblue",
              fontWeight: "600",
              marginLeft: "5px",
            }}
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
