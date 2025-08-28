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

const allowedOrigins = [
  "http://localhost:5173", // local frontend
  "https://fools-fortune-rqzq.vercel.app" // deployed frontend
];

// CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Preflight request
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

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
