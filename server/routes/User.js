import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Post from "../models/Posts.js"; 

const router = express.Router();

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

export default router;
