import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/Auth.js";
import userRoutes from "./routes/User.js";
import audioRoutes from "./routes/audio.js";
import postsRoutes from "./routes/posts.js";
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/audio", audioRoutes); 
app.get("/api/reddit", async (req, res) => {
  try {
    const response = await fetch("https://www.reddit.com/r/reactjs/hot.json?limit=5");
    const data = await response.json();
    res.json(data); // forward to frontend
  } catch (err) {
    console.error("❌ Error fetching Reddit:", err.message);
    res.status(500).json({ error: "Failed to fetch Reddit feed" });
  }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
