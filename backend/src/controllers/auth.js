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

