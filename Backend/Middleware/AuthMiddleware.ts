import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../Controller/prisma";

interface JwtPayload {
  user_id: number;
  email: string;
}

interface AuthenticatedUser {
  user_id: number;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      authenticatedUser?: AuthenticatedUser;
    }
  }
}

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ msg: "No token, authorization denied" });
      return;
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as JwtPayload;

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { user_id: decoded.user_id },
      select: {
        user_id: true,
        email: true,
      },
    });

    if (!user) {
      res.status(401).json({ msg: "User not found" });
      return;
    }

    // Add user to request object
    req.authenticatedUser = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// Middleware to check if user owns the resource
export const checkResourceOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.authenticatedUser?.user_id;
    const resourceUserId = parseInt(req.params.user_id || req.body.user_id, 10);

    if (!userId || !resourceUserId) {
      res.status(400).json({ msg: "User ID is required" });
      return;
    }

    if (userId !== resourceUserId) {
      res.status(403).json({ msg: "Access denied. Not authorized to access this resource" });
      return;
    }

    next();
  } catch (error) {
    console.error("Resource ownership check error:", error);
    res.status(500).json({ msg: "Error checking resource ownership" });
  }
};
