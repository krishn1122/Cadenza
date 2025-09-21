import { Router } from "express";
import { getProfile, getAllUsers, updateUserAdminStatus, updateUserCadenzaStatus } from "../controllers/user";
import { authenticateToken, isAdmin } from "../middlewares/auth";

const userRoutes = Router();

// Regular user routes
userRoutes.get("/me", authenticateToken, getProfile);

// Admin only routes
userRoutes.get("/all", authenticateToken, isAdmin, getAllUsers); // Get all users (admin only)
userRoutes.put("/:userId/admin-status", authenticateToken, isAdmin, updateUserAdminStatus); // Update admin status
userRoutes.put("/:userId/cadenza-status", authenticateToken, isAdmin, updateUserCadenzaStatus); // Update cadenza status

export default userRoutes;
