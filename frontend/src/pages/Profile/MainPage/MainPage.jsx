import React, { useState, useEffect } from "react";
import "./MainPage.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CenterFocusWeakIcon from "@mui/icons-material/CenterFocusWeak";
import LockResetIcon from "@mui/icons-material/LockReset";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import AddLinkIcon from "@mui/icons-material/AddLink";
import Post from "../../feed/Post/Post";
import { Link, useNavigate } from "react-router-dom";
import EditProfile from "../EditProfile/EditProfile";
import axios from "axios";
import useLoggedInUser from "../../../hooks/useLoggedInUser";
import { useTranslation } from "react-i18next";

const MainPage = ({ user }) => {
  const navigate = useNavigate();
  // const [imageURL, setImageURL] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // const [loggedInUser] = useLoggedInUser();
  const [loggedInUser, setLoggedInUser] = useLoggedInUser();

  const { t } = useTranslation();
  const username = user?.email?.split("@")[0];
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch(
      `https://twitter-clone-xylb.onrender.com//userPost?email=${user?.email}`
    )
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
      });
  }, [user?.email, posts]);

  const handleUploadCoverImage = (e) => {
    setIsLoading(true);
    const image = e.target.files[0];

    const formData = new FormData();
    formData.set("image", image);

    axios
      .post(
        "https://api.imgbb.com/1/upload?key=c1e87660595242c0175f82bb850d3e15",
        formData
      )
      .then((res) => {
        const url = res.data.data.display_url;

        const userCoverImage = {
          email: user?.email,
          coverImage: url,
        };
        setIsLoading(false);

        if (url) {
          axios
            .patch(
              `https://twitter-clone-xylb.onrender.com//userUpdates/${user?.email}`,
              userCoverImage
            )
            .then(() => {
              // Update local state
              setLoggedInUser((prev) => ({ ...prev, coverImage: url }));
            });
        }
      });
  };

  const handleUploadProfileImage = (e) => {
    setIsLoading(true);
    const image = e.target.files[0];

    const formData = new FormData();
    formData.set("image", image);

    axios
      .post(
        "https://api.imgbb.com/1/upload?key=c1e87660595242c0175f82bb850d3e15",
        formData
      )
      .then((res) => {
        const url = res.data.data.display_url;
        const userProfileImage = {
          email: user?.email,
          profileImage: url,
        };
        setIsLoading(false);
        if (url) {
          axios
            .patch(
              `https://twitter-clone-xylb.onrender.com//userUpdates/${user?.email}`,
              userProfileImage
            )
            .then(() => {
              // Update local state
              setLoggedInUser((prev) => ({ ...prev, profileImage: url }));
            });
        }
      });
  };

  return (
    <div>
      <ArrowBackIcon className="arrow-icon" onClick={() => navigate("/")} />
      <h4 className="heading-4">@{username}</h4>
      <div className="mainProfile">
        <div className="profile-bio">
          {
            <div>
              <div className="coverImageContainer">
                <img
                  style={{ objectFit: "cover" }}
                  src={
                    loggedInUser?.coverImage
                      ? loggedInUser?.coverImage
                      : "https://www.proactivechannel.com/Files/BrandImages/Default.jpg"
                  }
                  alt=""
                  className="coverImage"
                />
                <div className="hoverCoverImage">
                  <div className="imageIcon_tweetButton">
                    <label htmlFor="image" className="imageIcon">
                      {isLoading ? (
                        <LockResetIcon className="photoIcon photoIconDisabled " />
                      ) : (
                        <CenterFocusWeakIcon className="photoIcon" />
                      )}
                    </label>
                    <input
                      type="file"
                      id="image"
                      className="imageInput"
                      onChange={handleUploadCoverImage}
                    />
                  </div>
                </div>
              </div>
              <div className="avatar-img">
                <div className="avatarContainer">
                  <img
                    src={
                      loggedInUser?.profileImage
                        ? loggedInUser?.profileImage
                        : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
                    }
                    className="avatar"
                    alt=""
                  />
                  <div className="hoverAvatarImage">
                    <div className="imageIcon_tweetButton">
                      <label htmlFor="profileImage" className="imageIcon">
                        {isLoading ? (
                          <LockResetIcon className="photoIcon photoIconDisabled " />
                        ) : (
                          <CenterFocusWeakIcon className="photoIcon" />
                        )}
                      </label>
                      <input
                        type="file"
                        id="profileImage"
                        className="imageInput"
                        onChange={handleUploadProfileImage}
                      />
                    </div>
                  </div>
                </div>
                <div className="userInfo">
                  <div>
                    <h3 className="heading-3">
                      {loggedInUser?.name
                        ? loggedInUser.name
                        : user && user.displayName}
                    </h3>
                    <p className="usernameSection">@{username}</p>
                  </div>
                  <EditProfile
                    user={user}
                    loggedInUser={loggedInUser}
                    setLoggedInUser={setLoggedInUser}
                  />
                </div>
                <div className="infoContainer">
                  {loggedInUser?.bio ? <p>{loggedInUser.bio}</p> : ""}
                  <div className="locationAndLink">
                    {loggedInUser?.location ? (
                      <p className="subInfo">
                        <MyLocationIcon /> {loggedInUser?.location}
                      </p>
                    ) : (
                      ""
                    )}
                    {loggedInUser?.website ? (
                      <p className="subInfo link">
                        <AddLinkIcon /> {loggedInUser?.website}
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <h4 className="tweetsText">{"Tweets"}</h4>
                <hr />
              </div>
              {posts.map((p) => (
                <Post key={p._id} p={p} />
              ))}
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default MainPage;
