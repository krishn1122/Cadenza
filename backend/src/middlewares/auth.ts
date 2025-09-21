// middlewares/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models";

// Get JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_key";

export interface AuthRequest extends Request {
  user?: any;
  userId?: number;
}

// Middleware to authenticate JWT token
export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    
    // Fetch user details from database
    const user = await User.findByPk(decoded.userId);
    
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    
    // Attach user to request
    req.user = user;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

// Middleware to check if user is admin
export const isAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }
  
  if (!req.user.is_admin) {
    res.status(403).json({ message: "Admin access required" });
    return;
  }
  
  next();
};

// Middleware to handle OAuth authentication success
export const handleOauthSuccess = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    return res.status(401).redirect('/login?error=authentication_failed');
  }
  next();
};
