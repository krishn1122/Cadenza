import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback';

// LinkedIn OAuth configuration
const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID || '784vtef9bi95bk';
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET || 'WPL_AP1.ArT4QTAadBJb6kS9.b/S5hQ==';
const LINKEDIN_CALLBACK_URL = process.env.LINKEDIN_CALLBACK_URL || 'http://localhost:5000/api/auth/linkedin/callback';

export const configurePassport = (): void => {
  // Google OAuth Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
        scope: ['profile', 'email']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Get email from profile
          const email = profile.emails?.[0]?.value;
          
          // Check if we have a valid email
          if (!email) {
            return done(new Error('No email found in Google profile'));
          }
          
          // Check if user already exists
          let user = await User.findOne({ where: { 
            email,
            auth_provider: 'google'
          }});

          // Get profile picture if available
          const profilePicture = profile.photos?.[0]?.value || null;
          
          // If user doesn't exist, create a new one
          if (!user) {
            user = await User.create({
              full_name: profile.displayName,
              email, // Using validated email
              auth_provider: 'google',
              auth_provider_id: profile.id,
              profile_picture: profilePicture,
              // Both is_cadenza and is_admin default to false in the model
            });
          } else if (profilePicture && (!user.profile_picture || user.profile_picture !== profilePicture)) {
            // Update profile picture if it changed
            await user.update({ profile_picture: profilePicture });
          }

          return done(null, user);
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );

  // LinkedIn OAuth Strategy
  passport.use(
    new LinkedInStrategy(
      {
        clientID: LINKEDIN_CLIENT_ID,
        clientSecret: LINKEDIN_CLIENT_SECRET,
        callbackURL: LINKEDIN_CALLBACK_URL,
        scope: ['r_emailaddress', 'r_liteprofile'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Get email from profile
          const email = profile.emails?.[0]?.value;
          
          // Check if we have a valid email
          if (!email) {
            return done(new Error('No email found in LinkedIn profile'));
          }
          
          // Check if user already exists
          let user = await User.findOne({ where: { 
            email,
            auth_provider: 'linkedin'
          }});

          // If user doesn't exist, create a new one
          if (!user) {
            user = await User.create({
              full_name: profile.displayName,
              email, // Using validated email
              auth_provider: 'linkedin',
              auth_provider_id: profile.id,
              // Both is_cadenza and is_admin default to false in the model
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );

  // Serialize and Deserialize User
  passport.serializeUser((user, done) => {
    done(null, (user as User).id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await User.findByPk(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};
