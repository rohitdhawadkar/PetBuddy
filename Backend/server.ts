import express, { Request, Response, NextFunction } from "express";
import passport from "passport";
import path from "path";
import dotenv from "dotenv";
import Auth from "./Routes/AuthRoutes";
import { getProfile } from "./Controller/getProfile";
import "./config/passport"; // Ensure Passport strategy loads first
import pet from "./Routes/PetRoutes";
import PetProfile from "./Routes/PetProfileRoutes";
import { testRedis } from "./Controller/redis";
import healthRoutes from './Routes/HealthRoutes';
import TrainingSessionRoutes from './Routes/TrainingSessionRoutes';
import TrainingStyleRoutes from "./Routes/TrainingStyleRoutes";
import TrainingProgressRoutes from "./Routes/TrainingProgressRoutes";
import TrainerWorkingHoursRoutes from "./Routes/TrainerWorkingHoursRoutes";
import ClinicRoute from "./Routes/ClinicRoutes";
import AdminRoute from "./Routes/AdminRoutes";
import VetRoute from "./Routes/VetRoutes"
import cors from "cors";
dotenv.config();

const app = express();

// Configure CORS to allow requests from your frontend
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://pet-buddy-bf2rbyh90-rohitdhawadkars-projects.vercel.app',
    "https://pet-buddy-rohitdhawadkars-projects.vercel.app"
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));    

app.use(express.json());
app.use(passport.initialize());

testRedis();
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Google OAuth Routes
app.get(
  "/auth/google",
  (req: Request, res: Response, next: NextFunction) => {
    console.log("Google OAuth initiation request received");
    console.log("Current environment:", process.env.NODE_ENV || "development");
    next();
  },
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/callback",
  (req: Request, res: Response, next: NextFunction) => {
    console.log("Google OAuth callback received");
    console.log("Query parameters:", req.query);
    next();
  },
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
    failWithError: true,
  }),
  (req: Request, res: Response) => {
    const userData = req.user as any;
    
    // Determine frontend URL based on environment
    const frontendUrl = process.env.FRONTEND_URL || 
      (process.env.NODE_ENV === 'production' 
        ? 'https://petbuddy-frontend.vercel.app' 
        : 'http://localhost:5173');
    
    console.log(`Frontend URL determined as: ${frontendUrl}`);
    console.log(`User data: ${JSON.stringify(userData)}`);
    
    const redirectUrl = new URL('/oauth/callback', frontendUrl);
    
    // Add query parameters
    redirectUrl.searchParams.append('token', userData.token);
    
    if (userData.hasPets && userData.firstPetId) {
      redirectUrl.searchParams.append('pet_id', userData.firstPetId.toString());
    }
    
    if (userData.isNewUser) {
      redirectUrl.searchParams.append('new_user', 'true');
    }
    
    const finalRedirectUrl = redirectUrl.toString();
    console.log(`Redirecting to: ${finalRedirectUrl}`);
    
    // Redirect to the frontend OAuth handler
    res.redirect(finalRedirectUrl);
  },
  (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Google OAuth authentication error:", err);
    res.status(500).json({
      error: "Authentication failed",
      message: err.message,
      details: process.env.NODE_ENV === 'development' ? err : undefined
    });
  }
);

app.get("/profile", (req, res, next) => {
  getProfile(req, res, next).catch(next);
});

app.use("/Auth", Auth);
app.use("/pet", pet);
app.use("/petprofile", PetProfile);
app.use('/health', healthRoutes);
app.use("/training-session", TrainingSessionRoutes);
app.use("/training-style", TrainingStyleRoutes);
app.use("/training-progress", TrainingProgressRoutes);
app.use("/trainer-working-hours", TrainerWorkingHoursRoutes);
app.use("/clinic",ClinicRoute);
app.use("/admin",AdminRoute);
app.use("/vet",VetRoute);

// Error Handler Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start Server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
