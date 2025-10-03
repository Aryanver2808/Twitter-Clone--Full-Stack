import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import authRoutes from "./routes/Auth.js";
import userRoutes from "./routes/User.js";
import postsRoutes from "./routes/posts.js";
import audioRoutes from "./routes/audio.js";

// Ensure only your .env is loaded
dotenv.config({ path: path.resolve("./.env") });

const { MONGO_URI, PORT, JWT_SECRET, EMAIL_USER, EMAIL_PASS } = process.env;

if (!MONGO_URI || !JWT_SECRET) {
  console.error("❌ MONGO_URI or JWT_SECRET not set in .env");
  process.exit(1);
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Mount routes safely
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/audio", audioRoutes);

// React frontend setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

// Connect to MongoDB and start server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT || 5000, () => {
      console.log(`🚀 Server running on port ${PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
