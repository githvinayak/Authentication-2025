import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { deleteAccount, getProfile, getUserRole, updatePassword, updateProfile } from "../controllers/user.js";


const router = express.Router();

// 👤 Profile & Settings
router.get("/profile", isAuthenticated, getProfile);
router.put("/profile", isAuthenticated, updateProfile);
router.put("/password", isAuthenticated, updatePassword);
router.delete("/delete-account", isAuthenticated, deleteAccount);
router.get("/role", isAuthenticated, getUserRole);



module.exports = router;
