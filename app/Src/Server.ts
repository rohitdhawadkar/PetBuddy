import express, { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";
import Auth from "../Routes/AuthRoutes";

import dotenv from "dotenv";
import "./Auth";

import passport from "passport";

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
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});
app.get("/", (req, res) => {
  res.send('<a href="auth/google">Auth</a>');
});
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
    // Redirect with the JWT as a query parameter
    res.redirect(`/profile?token=${(req.user as any).token}`);
  },
);
app.get("/profile", async (req: Request, res: Response, next: NextFunction) => {
  interface JwtPayload {
    userId: number;
  }

  const getProfile = async (req: express.Request, res: express.Response) => {
    const token = req.query.token;

    if (typeof token !== "string") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Verify the JWT
    jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }

      // Token is valid, return user data
      res.json({
        message: "Welcome to your profile",
        user: decoded as JwtPayload,
      });
    });
  };
});

// Initialize Passport

// app.use(passport.session());

app.use("/Auth", Auth);

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
