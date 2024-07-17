import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login/Login.jsx";
import Signup from "./pages/Login/Signup.jsx";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./pages/protectedRoute.jsx";
import PageLoading from "./pages/PageLoading.jsx";
import Feed from "./pages/feed/Feed.jsx";
import Explore from "./pages/Explore/Explore.jsx";
import Notifications from "./pages/Notifications/Notifications.jsx";
import Messages from "./pages/Messages/Message.jsx";
import Bookmarks from "./pages/Bookmarks/Bookmark.jsx";
import List from "./pages/List/List.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import More from "./pages/More/More.jsx";
import Subscribe from "./pages/subscribe/Subscribe.jsx";

function App() {
  return (
    <>
      <div className="app">
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            >
              <Route index element={<Feed />} />
            </Route>
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            >
              <Route path="feed" element={<Feed />} />
              <Route path="explore" element={<Explore />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="messages" element={<Messages />} />
              <Route path="bookmarks" element={<Bookmarks />} />
              <Route path="lists" element={<List />} />
              <Route path="profile" element={<Profile />} />
              <Route path="Subscribe" element={<Subscribe />} />
              <Route path="more" element={<More />} />
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/page-loading" element={<PageLoading />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
