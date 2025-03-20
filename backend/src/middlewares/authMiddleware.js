import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import ErrorHandler, { TryCatch } from "./error.js";

export const isAuthenticated = TryCatch(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get token from Authorization header

  if (!token) {
    return next(new ErrorHandler("Not authorized, no token provided", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password"); // Attach user to req object
    if (!req.user) return next(new ErrorHandler("User not found", 404));

    next(); // Proceed to next middleware/controller
  } catch (error) {
    return next(new ErrorHandler("Invalid or expired token", 401));
  }
});

export const adminOnly = (req, res, next) => {
    if (req.user.role !== "admin") return next(new ErrorHandler("Access denied", 403));
    next();
  };