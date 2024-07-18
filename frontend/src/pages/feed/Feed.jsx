import React, { useEffect } from "react";
import "./Feed.css";
import TweetBox from "../Tweetbox/Tweetbox.jsx";
import axios from "axios";
import { useState } from "react";
import Post from "./Post/Post.jsx";

const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("https://twitter-clone-xylb.onrender.com//posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
      });
  }, [posts]);

  return (
    <div className="feed">
      <h4 style={{ margin: 0 }}>Home</h4>
      <TweetBox />
      {posts.map((p) => (
        <Post key={p._id} p={p} />
      ))}
    </div>
  );
};

export default Feed;
