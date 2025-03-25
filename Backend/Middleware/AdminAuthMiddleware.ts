import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../Controller/prisma";

interface JwtPayload {
  adminId: number;
}

declare global {
  namespace Express {
    interface Request {
      admin?: {
        admin_id: number;
        is_active: boolean;
      };
    }
  }
}

export const authenticateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // Check if admin exists and is active
    const admin = await prisma.admin.findUnique({
      where: { admin_id: decoded.adminId },
      select: {
        admin_id: true,
        is_active: true,
      },
    });

    if (!admin) {
      res.status(401).json({ message: "Admin not found" });
      return;
    }

    if (!admin.is_active) {
      res.status(403).json({ message: "Admin account is inactive" });
      return;
    }

    // Add admin to request object
    req.admin = admin;
    next();
  } catch (error) {
    console.error("Admin authentication error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
}; 