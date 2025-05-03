import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    console.log("ProtectRoute middleware hit");

    const token = req.cookies?.jwt; // safer check
    if (!token) {
      res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.userId) {
      res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    // Fetch user from database
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    req.user = user; // attach user to request
    next();
  } catch (error) {
    console.error("ProtectRoute error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
