import React from "react";
import Sidebar from "./Sidebar/Sidebar";
import Feed from "./feed/Feed";
import Widgets from "./Widgets/Widgets";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../firebase.init";
import { Outlet } from "react-router-dom";
import useLoggedInUser from "../hooks/useLoggedInUser";

const Home = () => {
  const user = useAuthState(auth);

  const handleLogout = () => {
    auth.signOut();
  };
  return (
    <div className="app">
      <Sidebar handleLogout={handleLogout} user={user} />
      <Outlet />
      <Widgets />
    </div>
  );
};

export default Home;
