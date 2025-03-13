import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";
import { User } from "../models/user.js";
import ErrorHandler, { TryCatch } from "../middlewares/error.js";
import { redisClient } from "../config/redis.js";

export const register = TryCatch(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return next(new ErrorHandler("All fields are required", 400));

  const userExists = await User.findOne({ email });
  if (userExists) return next(new ErrorHandler("User already exists", 400));

  const user = await user.create({ name, email, password });

  const verificationToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  await sendEmail(
    email,
    "Verify Email",
    `${process.env.BASE_URL}/verify/${verificationToken}`
  );

  res.status(201).json({
    message: "Registration successful. Check email for verification.",
  });
});

export const verifyEmail = TryCatch(async (req, res, next) => {
  const { token } = req.params;

  const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new ErrorHandler("Invalid or expired token", 400));
    }
    return decoded;
  });
  const user = await User.findById(decoded.id);
  if (!user) return next(new ErrorHandler("User not found", 404));

  user.isVerified = true;
  await user.save();

  res.json({ message: "Email verified. You can log in now." });
});
