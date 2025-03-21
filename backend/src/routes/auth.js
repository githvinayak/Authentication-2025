import express from "express"
import passport from "passport";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { disable2FA, enable2FA, forgotPassword, login, logout, logoutAll, oauthCallback, refreshToken, register, resetPassword, verify2FA, verifyEmail, verifyLogin2FA } from "../controllers/auth.js";


const app = express.Router();

// 📝 User Registration & Email Verification
app.post("/register", register);
app.get("/verify-email/:token", verifyEmail);

// 🔑 Authentication (Login / Logout)
app.post("/login", login);
app.post("/logout", isAuthenticated, logout);
app.post("/logout-all", isAuthenticated, logoutAll);

// 🔄 Token Refresh
app.post("/refresh-token", refreshToken);

// 🔒 Forgot & Reset Password
app.post("/forgot-password", forgotPassword);
app.post("/reset-password", resetPassword);

// 🔐 Two-Factor Authentication (2FA);
app.post("/2fa/enable", isAuthenticated, enable2FA);
app.post("/2fa/verify", isAuthenticated, verify2FA);
app.post("/2fa/disable", isAuthenticated, disable2FA);
app.post("/2fa/login", verifyLogin2FA);

// 🌍 OAuth (Google/GitHub Login)
app.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
app.get("/google/callback", passport.authenticate("google", { session: false }), oauthCallback);

// GitHub OAuth
app.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
app.get("/github/callback", passport.authenticate("github", { session: false }), oauthCallback);


export default app;
