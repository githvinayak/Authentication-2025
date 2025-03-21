import express from "express"
import passport from "passport";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { disable2FA, enable2FA, forgotPassword, login, logout, logoutAll, oauthCallback, refreshToken, register, resetPassword, verify2FA, verifyEmail, verifyLogin2FA } from "../controllers/auth.js";


const app = express.Router();

// 📝 User Registration & Email Verification
app.post("/register", register);
app.get("/verify-email/:token", verifyEmail);




export default app;
