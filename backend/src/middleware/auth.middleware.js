import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    console.log("ProtectRoute middleware hit");

    const token = req.cookies?.jwt; // safer check
    if (!token) {
      console.log("error in token")
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.userId) {
     console.log("erro in invalid token")
    }

    // Fetch user from database
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
  console.log("user not found")
    }

    req.user = user; // attach user to request
    next();
  } catch (error) {
    console.error("ProtectRoute error:", error.message);
    
  }
};
