import React from "react";
import { Avatar, Button } from "@mui/material";
import { useState } from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import axios from "axios";
import "./TweetBox.css";
import useLoggedInUser from "../../hooks/useLoggedInUser";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../firebase.init";

function TweetBox() {
  const [post, setPost] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const [loggedInUser] = useLoggedInUser();
  // console.log(loggedInUser);
  const [user] = useAuthState(auth);
  const email = user?.email;

  const userProfilePic = loggedInUser?.profileImage
    ? loggedInUser?.profileImage
    : "https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg";

  const handleUploadImage = (e) => {
    setIsLoading(true);
    const image = e.target.files[0];
    const formData = new FormData();
    formData.set("image", image);

    axios
      .post(
        "https://api.imgbb.com/1/upload?key=a77039304e62c8b340847e876ba7e0f0",
        formData
      )
      .then((res) => {
        setImageURL(res.data.data.display_url);
        console.log(res.data.data.display_url);
        // setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const handleTweet = async (e) => {
    e.preventDefault();
    if (user.providerData[0].providerId === "password") {
      fetch(`/api/loggedInUser?email=${email}`)
        .then((res) => res.json())
        .then((data) => {
          setName(data[0]?.name);
          setUsername(data[0]?.username);
        });
    } else {
      setName(user.displayName);
      setUsername(email?.split("@")[0]);
    }
    if (name) {
      const userPost = {
        profilePhoto: userProfilePic,
        post: post,
        photo: imageURL,
        username: username,
        name: name,
        email: email,
      };
      setPost("");
      setImageURL("");
      // console.log(userPost);
      fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(userPost),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        });
    }
  };

  return (
    <div className="tweetBox">
      <form onSubmit={handleTweet}>
        <div className="tweetBox__input">
          <Avatar
            src={
              loggedInUser?.profileImage
                ? loggedInUser?.profileImage
                : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
            }
          />
          <input
            onChange={(e) => setPost(e.target.value)}
            value={post}
            placeholder="What's happening?"
            type="text"
            required
          />
        </div>
        <div className="imageIcon_tweetButton">
          <label htmlFor="image" className="imageIcon">
            {isLoading ? (
              <p>Uploading image</p>
            ) : (
              <p>{imageURL ? "image uploaded" : <AddPhotoAlternateIcon />}</p>
            )}
          </label>
          <input
            type="file"
            id="image"
            className="imageInput"
            onChange={handleUploadImage}
          />
          <Button className="tweetBox__tweetButton" type="submit">
            Tweet
          </Button>
        </div>
      </form>
    </div>
  );
}

export default TweetBox;
