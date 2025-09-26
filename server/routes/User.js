import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Post from "../models/Posts.js"; 
import multer from "multer";
import path from "path";
import fs from "fs";


const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });


// ✅ Middleware to protect routes
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ✅ Logged-in user
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate("followers", "username")
      .populate("following", "username")
      .select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    // 👇 get posts
    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .select("_id text createdAt");

    res.json({
      id: user._id,
      name: user.name || user.username,
      username: user.username,
      bio: user.bio,
      avatar: user.avatar,
      banner: user.banner,
      followers: user.followers.length,
      following: user.following.length,
      joined: user.createdAt,
      posts,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Public profile by username
router.get("/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .populate("followers", "username")
      .populate("following", "username");

    if (!user) return res.status(404).json({ message: "User not found" });

    // 👇 get posts
    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .select("_id text createdAt");

    res.json({
      name: user.name || user.username,
      username: user.username,
      bio: user.bio,
      avatar: user.avatar,
      banner: user.banner,
      followers: user.followers.length,
      following: user.following.length,
      joined: user.createdAt,
      posts,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put(
  "/update",
  authMiddleware,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const user = await User.findById(req.userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      if (req.body.username) user.username = req.body.username;
      if (req.body.bio) user.bio = req.body.bio;

      // ✅ Normalize paths to use forward slashes
      if (req.files.avatar) {
        user.avatar = "/" + req.files.avatar[0].path.replace(/\\/g, "/");
      }
      if (req.files.banner) {
        user.banner = "/" + req.files.banner[0].path.replace(/\\/g, "/");
      }

      await user.save();

      res.json({ success: true, user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);


export default router;
