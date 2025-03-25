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
dotenv.config();

const app = express();
app.use(
  require("cors")({
    origin: "http://localhost:3000", // or your frontend URL
    credentials: true,
  }),
);

app.use(express.json());
app.use(passport.initialize());

testRedis();
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Google OAuth Routes
app.get(
  "/auth/google",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  }),
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.redirect(`/profile?token=${(req.user as any).token}`);
  },
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
