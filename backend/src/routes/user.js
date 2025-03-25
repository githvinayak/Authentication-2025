import express from "express";
import { adminOnly, isAuthenticated } from "../middlewares/authMiddleware.js";
import { deleteAccount, getProfile, getUserRole, updatePassword, updateProfile } from "../controllers/user.js";


const app = express.Router();

// 👤 Profile & Settings
app.get("/profile", isAuthenticated, getProfile);
app.put("/profile", isAuthenticated, updateProfile);
app.put("/password", isAuthenticated, updatePassword);
app.delete("/delete-account", isAuthenticated, deleteAccount);
app.get("/role", isAuthenticated, getUserRole);

// 🛑 Role-Based Access (Admin Only)
// app.get("/users", isAuthenticated, adminOnly, getAllUsers);
// app.get("/users/:id", isAuthenticated, adminOnly, getUserById);
// app.delete("/users/:id", isAuthenticated, adminOnly, deleteUserById);

export default app;
