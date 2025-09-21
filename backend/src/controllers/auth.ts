import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import passport from "passport";
import { User } from "../models";
import { AuthRequest } from "../middlewares/auth";

// Get JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_key";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Generate JWT token
const generateToken = (userId: number): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
};

// Register new user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { full_name, email, password } = req.body;

    // Validate input
    if (!full_name || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    // Check if email is a gmail.com address
    if (!email.endsWith('@gmail.com')) {
      res.status(400).json({ message: "Only Gmail addresses are allowed" });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Create new user
    const user = await User.create({
      full_name,
      email,
      password, // Will be hashed by pre-save hook in model
      is_cadenza: false,
      is_admin: false
    });

    // Generate JWT token
    const token = generateToken(user.id);

    // Return user info and token
    res.status(201).json({
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        is_cadenza: user.is_cadenza,
        is_admin: user.is_admin,
        profile_picture: user.profile_picture
      }
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login with email and password
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });

    // Check if user exists and password is valid
    if (!user || !(await user.validPassword(password))) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // Generate JWT token
    const token = generateToken(user.id);

    // Return user info and token
    res.status(200).json({
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        is_cadenza: user.is_cadenza,
        is_admin: user.is_admin,
        profile_picture: user.profile_picture
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Google OAuth handlers
export const googleAuth = (req: Request, res: Response): void => {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res);
};

export const googleCallback = (req: Request, res: Response): void => {
  passport.authenticate('google', { session: false }, (err, user) => {
    if (err || !user) {
      return res.redirect(`${FRONTEND_URL}/login?error=google_auth_failed`);
    }
    
    // Generate JWT token
    const token = generateToken(user.id);
    
    // Redirect to frontend with token
    res.redirect(`${FRONTEND_URL}/login-success?token=${token}`);
  })(req, res);
};

// LinkedIn OAuth handlers
export const linkedinAuth = (req: Request, res: Response): void => {
  passport.authenticate('linkedin')(req, res);
};

export const linkedinCallback = (req: Request, res: Response): void => {
  passport.authenticate('linkedin', { session: false }, (err: Error | null, user?: any) => {
    if (err || !user) {
      return res.redirect(`${FRONTEND_URL}/login?error=linkedin_auth_failed`);
    }
    
    // Generate JWT token
    const token = generateToken(user.id);
    
    // Redirect to frontend with token
    res.redirect(`${FRONTEND_URL}/login-success?token=${token}`);
  })(req, res);
};

// Handle OAuth success for frontend to get token and user info
export const loginSuccess = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.query;
  
  if (!token) {
    res.status(400).json({ message: "No token provided" });
    return;
  }
  
  try {
    // Verify the token
    const decoded = jwt.verify(token as string, JWT_SECRET) as { userId: number };
    
    // Find user by ID in the database
    const user = await User.findByPk(decoded.userId);
    
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    
    res.status(200).json({
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        is_cadenza: user.is_cadenza,
        is_admin: user.is_admin,
        profile_picture: user.profile_picture
      }
    });
  } catch (error) {
    console.error("Login success error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};
