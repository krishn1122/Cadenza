import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import session from "express-session";
import passport from "passport";

// Import routes
import userRoutes from "./routes/user";
import authRoutes from "./routes/auth";
import companyRoutes from "./routes/company";
import personRoutes from "./routes/person";
import blogRoutes from "./routes/blog";
import imageRoutes from "./routes/image";

// Import database and passport configuration
import { initDb } from "./models";
import { configurePassport } from "./config/passport";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Session configuration for OAuth
const SESSION_SECRET = process.env.SESSION_SECRET || 'session_secret_key';
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Configure and initialize Passport
configurePassport();
app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Serve static images
app.use('/images', express.static(path.join(__dirname, '../../frontend/public/assets/images')));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/people", personRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/images", imageRoutes);

// Serve static files from the React frontend app in production
const isProduction = process.env.NODE_ENV === 'production';
if (isProduction) {
  const frontendBuildPath = path.join(__dirname, '../../frontend/build');
  app.use(express.static(frontendBuildPath));

  // Handle React routing, return all requests to React app
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendBuildPath, "index.html"));
  });
}

// Initialize database and start server
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Initialize database and sync models
    const dbInitialized = await initDb();
    if (!dbInitialized) {
      throw new Error('Failed to initialize database');
    }
    
    // Seed the database with sample data
    try {
      const { seedDatabase } = require('./utils/seed');
      await seedDatabase();
      console.log('✅ Database seeded successfully');
    } catch (seedError) {
      console.warn('Warning: Database seeding failed, but continuing:', seedError);
      // Continue even if seeding fails
    }
    
    // Start server
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Only start the server if this file is run directly (not when imported for tests)
if (require.main === module) {
  startServer();
}

export default app;
