import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ProfilePage from "./profile/ProfilePage";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import MoreIcon from "@mui/icons-material/More";
import { 
  FaTwitter, 
  FaUsers, 
  FaBookmark, 
  FaListAlt, 
  FaStar, 
  FaCheckCircle, 
  FaMoneyBillAlt, 
  FaBullhorn, 
  FaCog, 
  FaComments 
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import featherIcon from "../assets/feather.png";
import { Avatar, Menu, MenuItem } from "@mui/material";
import { FaC } from "react-icons/fa6";

// ✅ SidebarOption (single icon button)
const SidebarOption = ({ Icon, active, onClick }) => {
  return (
    <div
      onClick={onClick}
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

  // Avatar menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // More icon menu state
  const [anchorElMore, setAnchorElMore] = useState(null);
  const openMore = Boolean(anchorElMore);

  // ✅ backend user info
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

        <SidebarOption Icon={SearchIcon} />

        <CustomLink to="/home/notification">
          <SidebarOption Icon={NotificationsNoneIcon} />
        </CustomLink>

        <SidebarOption Icon={MailOutlineIcon} />

        <CustomLink to={`/home/profile/${username}`}>
          <SidebarOption Icon={PermIdentityIcon} />
        </CustomLink>

        {/* ✅ More icon menu */}
        <SidebarOption
          Icon={MoreIcon}
          onClick={(e) => setAnchorElMore(e.currentTarget)}
        />

        <Menu
          anchorEl={anchorElMore}
          open={openMore}
          onClose={() => setAnchorElMore(null)}
          PaperProps={{
            sx: {
              width: 350,
              height: 700,
              ml: 6,
              mb: 14,
              bgcolor: "black",
              color: "white",
              boxShadow: "0 0 12px rgba(255,255,255,0.6)",
              borderRadius: "12px",
              mt: 0,

              py: 2, 
            },
          }}
          
        >
          <MenuItem  onClick={() => setAnchorElMore(null)} sx={{  fontSize: "1.2rem",fontWeight: "bold",my: 0,px: 4, "&:hover": { bgcolor: "#1a1a1a",fontSize: "1.1rem", gap: "4px" } }}>
         <FaComments className="mr-2"/>Chats</MenuItem>
          <MenuItem  onClick={() => setAnchorElMore(null)} sx={{  fontSize: "1.2rem",fontWeight: "bold",my: 1,px: 3, "&:hover": { bgcolor: "#1a1a1a",fontSize: "1.1rem", gap: "4px" } }}>
          <FaListAlt className="mr-2"/>Lists</MenuItem>
           <MenuItem  onClick={() => setAnchorElMore(null)} sx={{  fontSize: "1.2rem",fontWeight: "bold",my: 1,px: 3, "&:hover": { bgcolor: "#1a1a1a",fontSize: "1.1rem", gap: "4px" } }}>
          <FaBookmark className="mr-2"/>Bookmarks</MenuItem>
           <MenuItem  onClick={() => setAnchorElMore(null)} sx={{  fontSize: "1.2rem",fontWeight: "bold",my: 1,px: 3, "&:hover": { bgcolor: "#1a1a1a",fontSize: "1.1rem", gap: "4px" } }}>
          <FaStar className="text-yellow-500 mr-2"/>Premium</MenuItem>
           <MenuItem  onClick={() => setAnchorElMore(null)} sx={{  fontSize: "1.2rem",fontWeight: "bold",my: 1,px: 3, "&:hover": { bgcolor: "#1a1a1a",fontSize: "1.1rem", gap: "4px" } }}>
          <FaUsers className="mr-2"/>Communities</MenuItem>
           <MenuItem  onClick={() => setAnchorElMore(null)} sx={{  fontSize: "1.2rem",fontWeight: "bold",my: 1,px: 3, "&:hover": { bgcolor: "#1a1a1a",fontSize: "1.1rem", gap: "4px" } }}>
          <FaMoneyBillAlt className="mr-2"/>Monetization</MenuItem>
           <MenuItem  onClick={() => setAnchorElMore(null)} sx={{  fontSize: "1.2rem",fontWeight: "bold",my: 1,px: 3, "&:hover": { bgcolor: "#1a1a1a",fontSize: "1.1rem", gap: "4px" } }}>
          <FaCheckCircle className="mr-2"/>  Verified Orgs</MenuItem>
           <MenuItem  onClick={() => setAnchorElMore(null)} sx={{  fontSize: "1.2rem",fontWeight: "bold",my: 1,px: 3, "&:hover": { bgcolor: "#1a1a1a",fontSize: "1.1rem", gap: "4px" } }}>
          <FaBullhorn className="mr-2"/> Ads</MenuItem>
           <MenuItem  onClick={() => setAnchorElMore(null)} sx={{  fontSize: "1.2rem",fontWeight: "bold",my: 1,px: 3, "&:hover": { bgcolor: "#1a1a1a",fontSize: "1.1rem", gap: "4px" } }}>
          <FaCog className="mr-2"/> Settings and Privacy</MenuItem>

        </Menu>

        {/* Feather */}
        <button className="w-12 h-12 flex items-center justify-center bg-amber-50 hover:bg-gray-300 rounded-full transition-colors duration-200">
          <img src={featherIcon} className="w-6 h-6" alt="post" />
        </button>
      </div>

      {/* Avatar + menu */}
      <div className="flex flex-col items-center mb-8">
        <Avatar
          src={
            user?.avatar
              ? `http://localhost:5000${user.avatar.replace(/\\/g, "/")}`
              : "https://via.placeholder.com/150"
          }
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
            onClick={() => {
              localStorage.removeItem("user");
              localStorage.removeItem("token");
              if (handlelogout) handlelogout();
              navigate("/signup", { replace: true });
              handleClose();
            }}
            sx={{ "&:hover": { bgcolor: "#1a1a1a" } }}
          >
            Add an existing account ?
          </MenuItem>
          <MenuItem
            onClick={() => {
              localStorage.removeItem("user");
              localStorage.removeItem("token");
              if (handlelogout) handlelogout();
              navigate("/login", { replace: true });
              handleClose();
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
