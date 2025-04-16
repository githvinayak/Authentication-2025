import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";
import { User } from "../models/user.js";
import ErrorHandler, { TryCatch } from "../middlewares/error.js";
import { redisClient } from "../config/redis.js";
import crypto from "crypto";

export const register = TryCatch(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return next(new ErrorHandler("All fields are required", 400));

  const userExists = await User.findOne({ email });
  if (userExists) return next(new ErrorHandler("User already exists", 400));

  const user = await User.create({ name, email, password });

  const verificationToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  await sendEmail(
    email,
    "Verify Email",
    `${process.env.CLIENT_URL}/verify-email/${verificationToken}`
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

export const login = TryCatch(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new ErrorHandler("Email and password required", 400));

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new ErrorHandler("Invalid credentials", 400));
  }

  if (!user.isVerified)
    return next(new ErrorHandler("Email not verified", 403));
  // 🔹 If 2FA is enabled, generate and send OTP
  if (user.twoFactorEnabled) {
    const otp = crypto.randomInt(100000, 999999).toString(); // Generate 6-digit OTP
    await redisClient.setEx(`2fa:otp:${user._id}`, 300, otp); // Store OTP in Redis (expires in 5 minutes)

    // Send OTP via Email
    await sendEmail(
      user.email,
      "Login OTP - Two-Factor Authentication",
      `Your 2FA OTP is: ${otp}. It is valid for 5 minutes.`
    );

    return res.status(206).json({
      message: "2FA required. OTP sent to your email.",
      twoFactorRequired: true,
      userId: user._id, // Send user ID for verifying 2FA
    });
  }

  // 🔹 If 2FA is NOT required, issue JWT tokens immediately
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  // Store refresh token in Redis (Set allows multiple tokens)
  const redisKey = `user:${user._id}:tokens`;
  const keyType = await redisClient.type(redisKey);
  if (keyType !== "set" && keyType !== "none") {
    await redisClient.del(redisKey);
  }
  await redisClient.sAdd(redisKey, refreshToken);
  if ((await redisClient.ttl(redisKey)) === -1) {
    await redisClient.expire(redisKey, 7 * 24 * 60 * 60);
  }

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });

  res.status(200).json({
    message: "Login successful",
    accessToken,
    twoFactorEnabled: user.twoFactorEnabled,
  });
});

export const forgotPassword = TryCatch(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new ErrorHandler("Email is required", 400));

  const user = await User.findOne({ email });
  if (!user) return next(new ErrorHandler("User not found", 404));

  const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  await sendEmail(user.email, "Reset Your Password", `Click here: ${resetUrl}`);

  res.json({ message: "Password reset link sent!" });
});

export const resetPassword = TryCatch(async (req, res, next) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword)
    return next(new ErrorHandler("Token and new password required", 400));
  const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new ErrorHandler("Invalid or expired token", 400));
    }
    return decoded;
  });
  const user = await User.findById(decoded.id);
  if (!user) return next(new ErrorHandler("User not found", 404));

  user.password = newPassword;
  await user.save();

  res.json({ message: "Password reset successful" });
});

export const refreshToken = TryCatch(async (req, res, next) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return next(new ErrorHandler("No refresh token", 401));

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Check if the refresh token exists in Redis Set
    const exists = await redisClient.sismember(
      `user:${decoded.id}:tokens`,
      refreshToken
    );

    if (!exists) return next(new ErrorHandler("Invalid refresh token", 403));

    // Generate a new access token
    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    next(new ErrorHandler("Invalid refresh token", 403));
  }
});

export const logout = TryCatch(async (req, res, next) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return next(new ErrorHandler("No refresh token", 401));

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // 🔹 Remove only this session's token from Redis Set
    await redisClient.sRem(`user:${decoded.id}:tokens`, refreshToken);

    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    next(new ErrorHandler("Logout failed", 500));
  }
});

export const logoutAll = TryCatch(async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return next(new ErrorHandler("No refresh token provided", 401));

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // ❗ Delete ALL refresh tokens for this user
    await redisClient.del(`user:${decoded.id}:tokens`);

    res.clearCookie("refreshToken");
    res
      .status(200)
      .json({ message: "Logged out from all devices successfully" });
  } catch (error) {
    next(new ErrorHandler("Logout failed", 500));
  }
});

export const oauthCallback = TryCatch(async (req, res, next) => {
  const user = req.user;

  if (!user) return next(new ErrorHandler("OAuth login failed", 400));

  const accessToken = generateToken(user._id, process.env.JWT_SECRET, "15m");
  const refreshToken = generateToken(
    user._id,
    process.env.JWT_REFRESH_SECRET,
    "7d"
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });

  res.status(200).json({ accessToken });
});

export const enable2FA = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) return next(new ErrorHandler("User not found", 404));

  if (user.twoFactorEnabled) {
    return next(new ErrorHandler("2FA is already enabled", 400));
  }

  // Generate a 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();

  // Store OTP in Redis (expires in 5 minutes)
  await redisClient.setEx(`2fa:otp:${user.id}`, 300, otp);

  // Send OTP via Email
  await sendEmail(
    user.email,
    "Enable 2FA - Your OTP",
    `Your 2FA OTP is: ${otp}. It is valid for 5 minutes.`
  );

  res.status(200).json({
    message: "OTP sent to your email for 2FA verification",
  });
});

export const disable2FA = TryCatch(async (req, res, next) => {
  const { password } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) return next(new ErrorHandler("User not found", 404));

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return next(new ErrorHandler("Invalid password", 401));

  user.twoFactorEnabled = false;
  await user.save();

  res.status(200).json({ message: "2FA disabled successfully" });
});

export const verify2FA = TryCatch(async (req, res, next) => {
  const { otp } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) return next(new ErrorHandler("User not found", 404));

  // Retrieve OTP from Redis
  const storedOtp = await redisClient.get(`2fa:otp:${user.id}`);

  if (!storedOtp || storedOtp !== otp) {
    return next(new ErrorHandler("Invalid or expired OTP", 400));
  }

  // Remove OTP from Redis after verification
  await redisClient.del(`2fa:otp:${user.id}`);

  // Enable 2FA for the user
  user.twoFactorEnabled = true;
  await user.save();

  res.status(200).json({ message: "2FA enabled successfully" });
});

export const verifyLogin2FA = TryCatch(async (req, res, next) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user) return next(new ErrorHandler("User not found", 404));

  // Retrieve OTP from Redis
  const storedOtp = await redisClient.get(`2fa:otp:${user.id}`);

  if (!storedOtp || storedOtp !== otp) {
    return next(new ErrorHandler("Invalid or expired OTP", 400));
  }

  // Remove OTP from Redis after verification
  await redisClient.del(`2fa:otp:${user.id}`);

  // Generate access & refresh tokens
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });

  res.status(200).json({ message: "2FA login successful", accessToken });
});

export const verifyPassword = TryCatch(async (req, res, next) => {
  const { password } = req.body;
  const user = await User.findById(req.user.id);

  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ error: "Incorrect current password" });
  }
  res.status(200).json({ success: true });
});
