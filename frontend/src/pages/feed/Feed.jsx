import React, { useEffect } from "react";
import "./Feed.css";
import TweetBox from "../Tweetbox/Tweetbox.jsx";
import axios from "axios";
import { useState } from "react";
import Post from "./Post/Post.jsx";

const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/posts")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
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
