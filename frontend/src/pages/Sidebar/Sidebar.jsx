import X from "@mui/icons-material/X";
import "./Sidebar.css";
import { useState } from "react";
import XIcon from "@mui/icons-material/X";
import SidebarOption from "./SidebarOption";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import LanguageSelector from "../language/language-selector";

import {
  Button,
  Divider,
  Icon,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
} from "@mui/material";
import { Avatar } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import { Link } from "react-router-dom";
import CustomLink from "./CustomLink";
import useLoggedInUser from "../../hooks/useLoggedInUser";
import { use } from "i18next";
import { useTranslation } from "react-i18next";
import "../../i18n";

const Sidebar = ({ handleLogout, user }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [loggedInUser, setLoggedInUser] = useLoggedInUser();
  const { t } = useTranslation(["translation"]);

  const userProfilePic = loggedInUser?.profileImage
    ? loggedInUser?.profileImage
    : "https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg";

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const result = user[0]?.email.split("@")[0];

  return (
    <div className="sidebar">
      {/*  <XIcon className="sidebar__TwitterIcon" /> */}
      <LanguageSelector />

      <div className="sidebar__options">
        <CustomLink to="/home/feed">
          <SidebarOption active Icon={HomeIcon} text={t("Home")} />
        </CustomLink>
        <CustomLink to="/home/explore">
          <SidebarOption Icon={SearchIcon} text={t("Explore")} />
        </CustomLink>
        <CustomLink to="/home/notifications">
          <SidebarOption
            Icon={NotificationsNoneIcon}
            text={t("Notifications")}
          />
        </CustomLink>
        <CustomLink to="/home/messages">
          <SidebarOption Icon={MailOutlineIcon} text={t("Messages")} />
        </CustomLink>
        <CustomLink to="/home/bookmarks">
          <SidebarOption Icon={BookmarkBorderIcon} text={t("Bookmarks")} />
        </CustomLink>
        <CustomLink to="/home/lists">
          <SidebarOption Icon={ListAltIcon} text={t("Lists")} />
        </CustomLink>
        <CustomLink to="/home/profile">
          <SidebarOption Icon={PermIdentityIcon} text={t("Profile")} />
        </CustomLink>
        <CustomLink to="/home/subscribe">
          <SidebarOption Icon={LoyaltyIcon} text={t("Premium")} />
        </CustomLink>
        <CustomLink to="/home/more">
          <SidebarOption Icon={MoreHorizIcon} text={t("More")} />
        </CustomLink>
        <Button variant="outlined" className="sidebar_tweet">
          {t("Tweet")}
        </Button>

        <div className="profile-info">
          <Avatar src={userProfilePic}></Avatar>
          <div className="user-info">
            <h4>
              {loggedInUser?.name
                ? loggedInUser?.name
                : user && user[0]?.displayName}
            </h4>
            <h5>@{result}</h5>
          </div>
          <IconButton
            size="small"
            sx={{ ml: 2 }}
            aria-controls={openMenu ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openMenu ? "true" : undefined}
            onClick={handleClick}
          >
            <MoreHorizIcon style={{ color: "white" }} />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleClose}
          >
            <MenuItem className="Profile-info1">
              <Avatar
                src={
                  loggedInUser?.profileImage
                    ? loggedInUser?.profileImage
                    : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
                }
              ></Avatar>
              <div className="user_info subUser_info">
                <div>
                  <h4>
                    {" "}
                    {loggedInUser?.name
                      ? loggedInUser?.name
                      : user && user[0]?.displayName}
                  </h4>
                  <h5>@{result}</h5>
                </div>
                <ListItemIcon className="done_icon">
                  <DoneIcon></DoneIcon>
                </ListItemIcon>
              </div>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleClose}>Add an existing account</MenuItem>
            <MenuItem onClick={handleLogout}>Log out</MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
