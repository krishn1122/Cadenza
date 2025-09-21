import { Router } from "express";
import { 
  register,
  login, 
  googleAuth, 
  googleCallback, 
  linkedinAuth, 
  linkedinCallback,
  loginSuccess
} from "../controllers/auth";
import { handleOauthSuccess } from "../middlewares/auth";

const authRoutes = Router();

// Registration and login routes
authRoutes.post("/register", register);
authRoutes.post("/login", login);

// Google OAuth routes
authRoutes.get("/google", googleAuth);
authRoutes.get("/google/callback", googleCallback);

// LinkedIn OAuth routes
authRoutes.get("/linkedin", linkedinAuth);
authRoutes.get("/linkedin/callback", linkedinCallback);

// Handle OAuth success for frontend
authRoutes.get("/login-success", loginSuccess);

export default authRoutes;
