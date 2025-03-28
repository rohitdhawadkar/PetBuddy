import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

// Define types for Passport
type DoneCallback = (error: Error | null, user?: any) => void;

// Log the client ID being used for debugging
console.log("Using Google Client ID:", process.env.GOOGLE_CLIENT_ID?.substring(0, 10) + "...");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Use a env variable for the callback URL to make it easier to configure
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 
                  (process.env.NODE_ENV === 'production' 
                    ? "https://petbuddy-production.up.railway.app/auth/google/callback" 
                    : "http://localhost:3000/auth/google/callback"),
      passReqToCallback: true,
    },
    async (
      req: any,
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: DoneCallback,
    ) => {
      try {
        console.log("Google auth profile received:", {
          id: profile.id,
          displayName: profile.displayName,
          email: profile.emails?.[0]?.value
        });
        
        const email = profile.emails?.[0].value;
        if (!email) return done(new Error("No email found"));

        // First, just find the user
        let user = await prisma.user.findUnique({ 
          where: { email },
        });

        let isNewUser = false;
        let hasPets = false;
        let firstPetId = null;

        if (!user) {
          // Create a new user for first-time Google sign-in
          isNewUser = true;
          user = await prisma.user.create({
            data: {
              email,
              username: profile.displayName || email.split('@')[0],
              password: null,
            },
          });
          console.log("Created new user:", user.user_id);
        } else {
          console.log("Found existing user:", user.user_id);
          
          // Check if user has pets
          const pets = await prisma.pet.findMany({
            where: { user_id: user.user_id },
            select: { pet_id: true },
            take: 1,
          });
          
          hasPets = pets.length > 0;
          firstPetId = pets[0]?.pet_id || null;
          console.log("User has pets:", hasPets, "First pet ID:", firstPetId);
        }

        const token = jwt.sign(
          { 
            user_id: user.user_id,
            username: user.username || email // Use email as fallback for username
          },
          process.env.JWT_SECRET!,
          { expiresIn: "24h" },
        );

        console.log("Authentication successful, token generated");
        
        return done(null, { 
          user, 
          token,
          isNewUser,
          hasPets,
          firstPetId
        });
      } catch (error) {
        console.error("Google authentication error:", error);
        return done(error as Error);
      }
    },
  ),
);

export default passport;
