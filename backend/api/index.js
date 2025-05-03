import express from "express";
import authRoutes from "../src/routes/auth.routes.js";
import messageRoutes from "../src/routes/message.routes.js";
import dotenv from "dotenv";
import { connectDB } from "../src/lib/db.js";
import cookieparser from "cookie-parser";
import { app, server } from "../src/lib/socket.js";
import cors from "cors";
import path from "path";

dotenv.config();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

const allowedOrigins = [
  'http://localhost:5173', // for local development
  'https://vercel-deployment-black-eight.vercel.ap' // for deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // if you're using cookies or sessions
}));

app.get("/", (req, res) => {
  res.send("✅ Hello from Express!");});
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  connectDB();
});
