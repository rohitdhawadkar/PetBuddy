import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: number;
}

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.query.token;

    if (typeof token !== "string") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }

      res.json({
        message: "Welcome to your profile",
        user: decoded as JwtPayload,
      });
    });
  } catch (error) {
    next(error); // Pass errors to the Express error handler
  }
};
