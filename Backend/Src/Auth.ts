import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

// Define types for Passport
type User = any; // Replace with your actual User type
type DoneCallback = (error: Error | null, user?: false | User) => void;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:3000/auth/google/callback",
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
        const email = profile.emails?.[0].value;
        if (!email) return done(new Error("No email found"));

        let user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          // Create a user without a username or password
          user = await prisma.user.create({
            data: {
              email,
              username: null, // User can set this later
              password: null, // No password for OAuth users
            },
          });
        }

        // Issue a JWT
        const token = jwt.sign(
          { userId: user.user_id },
          process.env.JWT_SECRET!,
          {
            expiresIn: "1h",
          },
        );

        return done(null, { user, token });
      } catch (error) {
        return done(error as Error);
      }
    },
  ),
);

// This should include 'google'

// Serialize and deserialize user
// passport.serializeUser((user, done) => {
//   done(null, user as User);
// });

// passport.deserializeUser((obj: any, done) => {
//   done(null, obj as User);
// });

export default passport;
