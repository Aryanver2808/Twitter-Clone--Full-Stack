import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ProfilePage from "./profile/ProfilePage";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import MoreIcon from "@mui/icons-material/More";
import { FaXTwitter } from "react-icons/fa6";
import featherIcon from "../assets/feather.png";
import { Avatar, Menu, MenuItem } from "@mui/material";

// ✅ SidebarOption (single icon button)
const SidebarOption = ({ Icon, active }) => {
  return (
    <div
      className={`flex items-center justify-center h-12 w-12 rounded-full cursor-pointer transition-colors duration-200
        ${
          active
            ? "bg-sky-500 text-white"
            : "hover:bg-gray-900 text-gray-200"
        }`}
    >
      <Icon style={{ fontSize: 26 }} />
    </div>
  );
};

// ✅ Custom NavLink wrapper
const CustomLink = ({ to, children }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive ? "text-sky-500 no-underline" : "text-white no-underline"
      }
    >
      {children}
    </NavLink>
  );
};

const Sidebar = ({ handlelogout, user }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // ✅ backend se mila user
  const username = user?.username || "guest";
  const email = user?.email || "demo@example.com";

  return (
    <div className="sticky top-0 flex flex-col items-end justify-between h-screen w-40 bg-black text-white pr-2">
      {/* 🔝 Navigation icons */}
      <div className="flex flex-col gap-2 items-end w-full">
        <FaXTwitter className="text-white text-[35px] mb-4 mt-4 mr-2" />
        <CustomLink to="/home/feed">
          <SidebarOption active Icon={HomeIcon} />
        </CustomLink>
        <CustomLink to="/home/explore">
          <SidebarOption Icon={SearchIcon} />
        </CustomLink>
        <CustomLink to="/home/notification">
          <SidebarOption Icon={NotificationsNoneIcon} />
        </CustomLink>
        <CustomLink to="/home/messages">
          <SidebarOption Icon={MailOutlineIcon} />
        </CustomLink>
        <CustomLink to={`/home/profile/${username}`}>
          <SidebarOption Icon={PermIdentityIcon} />
        </CustomLink>
        <CustomLink to="/home/more">
          <SidebarOption Icon={MoreIcon} />
        </CustomLink>
        <button className="w-12 h-12 flex items-center justify-center bg-amber-50 hover:bg-gray-300 rounded-full transition-colors duration-200">
          <img src={featherIcon} className="w-6 h-6" alt="post" />
        </button>
      </div>
<div className="flex flex-col items-center mb-8">
      <Avatar
        src={"https://cdn-icons-png.flaticon.com/512/149/149071.png"}
        onClick={handleClick}
        className="cursor-pointer size-8"
      />

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleClose}
        PaperProps={{
          sx: {
            bgcolor: "black",
            color: "white",
            boxShadow: "0 0 12px rgba(255,255,255,0.6)",
            borderRadius: "12px",
            mt: 0,
          },
        }}
      >
        <MenuItem
          onClick={handleClose}
          sx={{ "&:hover": { bgcolor: "#1a1a1a" } }}
        >
          Add an existing account
        </MenuItem>
        <MenuItem
  onClick={() => {
    // Clear localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Optional: reset parent state if passed
    if (handlelogout) handlelogout();

    // Redirect to login page
    navigate("/login", { replace: true });

    handleClose(); // close menu
  }}
  sx={{ "&:hover": { bgcolor: "#1a1a1a" } }}
>
  Log out @{username}
</MenuItem>

      </Menu>
    </div>
    </div>
  );
};

export default Sidebar;
