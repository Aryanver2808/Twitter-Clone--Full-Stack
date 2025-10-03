import express from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import Post from "../models/Posts.js";
import User from "../models/User.js";


const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});
const upload = multer({ storage });

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
router.post(
  "/",
  authMiddleware,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { text } = req.body;

      if (!text && !req.files?.image && !req.files?.audio) {
        return res.status(400).json({ message: "Nothing to post" });
      }

      const newPost = new Post({
        user: req.userId, // comes from verifyToken middleware
        text: text || "",
        image: req.files.image
          ? "/" + req.files.image[0].path.replace(/\\/g, "/")
          : null,
        audio: req.files.audio
          ? "/" + req.files.audio[0].path.replace(/\\/g, "/")
          : null,
        likes: [],
        comments: [],
      });

      await newPost.save();

      // Populate user info for frontend
      const populatedPost = await newPost.populate("user", "username avatar name");

      res.status(201).json(populatedPost);
    } catch (err) {
      console.error("Error creating post:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "username avatar name").sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
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

// ✅ Update user profile (with avatar/banner upload)
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

      // ✅ Normalize paths (fix for Windows backslashes)
      if (req.files.avatar) {
        user.avatar = "/" + req.files.avatar[0].path.replace(/\\/g, "/");
      }
      if (req.files.banner) {
        user.banner = "/" + req.files.banner[0].path.replace(/\\/g, "/");
      }

      await user.save();

      res.json({ success: true, user });
    } catch (err) {
      console.error("Error updating profile:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
