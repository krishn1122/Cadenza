import { Request, Response } from "express";
import { User } from "../models";
import { AuthRequest } from "../middlewares/auth";

// Get current user profile
export const getProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    // User should be attached to the request by the authenticateToken middleware
    if (!req.user) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    // Return user data
    res.status(200).json({
      id: req.user.id,
      full_name: req.user.full_name,
      email: req.user.email,
      is_cadenza: req.user.is_cadenza,
      is_admin: req.user.is_admin
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all users (admin only)
export const getAllUsers = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    // Get all users from database
    const users = await User.findAll({
      attributes: ['id', 'full_name', 'email', 'is_cadenza', 'is_admin', 'auth_provider', 'createdAt']
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user admin status (admin only)
export const updateUserAdminStatus = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { is_admin } = req.body;

    // Validate input
    if (typeof is_admin !== 'boolean') {
      res.status(400).json({ message: "is_admin must be a boolean value" });
      return;
    }

    // Find user by ID
    const user = await User.findByPk(parseInt(userId));

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Update admin status
    await user.update({ is_admin });

    res.status(200).json({
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      is_cadenza: user.is_cadenza,
      is_admin: user.is_admin
    });
  } catch (error) {
    console.error("Update user admin status error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user Cadenza status (admin only)
export const updateUserCadenzaStatus = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { is_cadenza } = req.body;

    // Validate input
    if (typeof is_cadenza !== 'boolean') {
      res.status(400).json({ message: "is_cadenza must be a boolean value" });
      return;
    }

    // Find user by ID
    const user = await User.findByPk(parseInt(userId));

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Update cadenza status
    await user.update({ is_cadenza });

    res.status(200).json({
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      is_cadenza: user.is_cadenza,
      is_admin: user.is_admin
    });
  } catch (error) {
    console.error("Update user cadenza status error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
