import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// ---------- Middlewares ----------
app.use(express.json());

// Allow CORS from frontend (both localhost and deployed)
app.use(
  cors({
    origin: [
      "http://localhost:5173", // your local frontend
      "https://fools-fortune-rqzq.vercel.app/" // <-- replace with your deployed frontend URL
    ],
    credentials: true, // allow cookies if needed
  })
);

app.use(helmet());
app.use(cookieParser());

// ---------- Routes ----------
app.get("/", (req, res) => {
  res.send("✅ Game Server is running!");
});

app.use("/api/auth", authRoutes);

// ---------- MongoDB ----------
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ Missing MONGO_URI in environment variables!");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
