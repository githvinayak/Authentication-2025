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

export const login = TryCatch(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new ErrorHandler("Email and password required", 400));

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new ErrorHandler("Invalid credentials", 400));
  }
  if (!user.isVerified)
    return next(new ErrorHandler("Email not verified", 403));

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

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
  res.json({ message: "Login Successfully", accessToken });
});

export const forgotPassword = TryCatch(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new ErrorHandler("Email is required", 400));

  const user = await User.findOne({ email });
  if (!user) return next(new ErrorHandler("User not found", 404));

  const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  const resetUrl = `${process.env.BASE_URL}/reset-password?token=${resetToken}`;
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

    // Check if refresh token is blacklisted in Redis
    const isBlacklisted = await redisClient.get(decoded.id);
    if (isBlacklisted)
      return next(new ErrorHandler("Refresh token invalid", 403));

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

export const logout = TryCatch(async (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
});

export const logoutAll = TryCatch(async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return next(new ErrorHandler("No refresh token provided", 401));

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    await redisClient.set(decoded.id, "blacklisted", "EX", 7 * 24 * 60 * 60); // Blacklist for 7 days

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

  const secret = speakeasy.generateSecret({ length: 20 });

  user.twoFactorSecret = secret.base32;
  user.twoFactorEnabled = true;
  await user.save();

  const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
  res.json({ message: "2FA enabled", qrCodeUrl });
});

export const disable2FA = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  user.twoFactorEnabled = false;
  user.twoFactorSecret = null;
  await user.save();

  res.status(200).json({ message: "Two-Factor Authentication disabled" });
});

