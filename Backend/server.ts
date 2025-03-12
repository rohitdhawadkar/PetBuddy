import express, { Request, Response, NextFunction } from "express";
import passport from "passport";
import dotenv from "dotenv";
import Auth from "./Routes/AuthRoutes";
import { getProfile } from "./Controller/getProfile";
import "./config/passport"; // Ensure Passport strategy loads first

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

app.get("/", (req, res) => {
  res.send('<a href="auth/google">Auth</a>');
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

// Fix: Add `next` parameter for proper async error handling
app.get("/profile", (req, res, next) => {
  getProfile(req, res, next).catch(next); // Ensures proper async error handling
});

app.use("/Auth", Auth);

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
