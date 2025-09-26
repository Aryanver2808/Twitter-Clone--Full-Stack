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
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/audio", audioRoutes); 


app.get("/api/reddit", async (req, res) => {
  try {
    const response = await fetch(
      "https://www.reddit.com/r/reactjs/hot.json?limit=5",
      {
        headers: {
          "User-Agent": "TwitterCloneApp/1.0 (by yourusername)", // Reddit requires this
        },
      }
    );

    // Handle HTTP errors from Reddit
    if (!response.ok) {
      console.error(`Reddit API returned status ${response.status}`);
      return res.status(500).json({ error: "Failed to fetch Reddit feed" });
    }

    const data = await response.json();

    // Forward only needed info to frontend
    const posts = data.data?.children?.map((post) => {
      const p = post.data;
      return {
        id: p.id,
        username: p.author,
        content: p.title,
        image:
          p.preview?.images?.[0]?.source?.url?.replace(/&amp;/g, "&") ||
          (p.thumbnail?.startsWith("http") ? p.thumbnail : null),
        likes: p.ups,
        comments: p.num_comments,
        createdAt: new Date(p.created_utc * 1000).toLocaleString(),
      };
    }) || [];

    res.json({ posts }); // frontend expects { posts: [...] }
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
