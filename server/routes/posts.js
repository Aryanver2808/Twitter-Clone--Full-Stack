import express from "express";
import jwt from "jsonwebtoken";
import Post from "../models/Posts.js";
import User from "../models/User.js";

const router = express.Router();

// ✅ Auth middleware
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

// ✅ Create a new post
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { text, audio } = req.body;
    if (!text && !audio) return res.status(400).json({ message: "Nothing to post" });

    const newPost = new Post({
      user: req.userId,
      text,
      audio: audio || null,
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get all posts by username
router.get("/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const posts = await Post.find({ user: user._id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
