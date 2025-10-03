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

// -----------------------------
// ✅ Dotenv - Only load your .env file
// -----------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load only .env from server folder
dotenv.config({ path: path.join(__dirname, ".env"), override: true });

// -----------------------------
// ✅ Whitelisted environment variables
// -----------------------------
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

if (!MONGO_URI || !JWT_SECRET) {
  console.error("❌ MONGO_URI or JWT_SECRET missing in .env");
  process.exit(1);
}

// -----------------------------
// ✅ Express app setup
// -----------------------------
const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// -----------------------------
// ✅ Mount API routes
// -----------------------------
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/audio", audioRoutes);

// -----------------------------
// ✅ Serve React frontend
// -----------------------------
app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// -----------------------------
// ✅ Connect to MongoDB and start server
// -----------------------------
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
