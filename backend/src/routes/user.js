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

// 🛑 Role-Based Access (Admin Only)
router.get("/users", isAuthenticated, isAdmin, getAllUsers);
router.get("/users/:id", isAuthenticated, isAdmin, getUserById);
router.delete("/users/:id", isAuthenticated, isAdmin, deleteUserById);

module.exports = router;
