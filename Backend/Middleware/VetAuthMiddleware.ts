import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../Controller/prisma";
import { Vet, Clinic, WorkingHours } from "@prisma/client";

interface JwtPayload {
  userId: number;
  role: string;
}

interface VetWithRelations extends Vet {
  clinic: Clinic;
  WorkingHours: WorkingHours[];
}

interface AuthenticatedRequest extends Request {
  vet?: VetWithRelations;
}

export const authenticateVet = async (
  req: AuthenticatedRequest,
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

    // Check if vet exists
    const vet = await prisma.vet.findUnique({
      where: { vet_id: decoded.userId },
      include: {
        clinic: true,
        WorkingHours: true,
      },
    });

    if (!vet) {
      res.status(401).json({ message: "Vet not found" });
      return;
    }

    // Add vet to request object
    req.vet = vet as VetWithRelations;
    next();
  } catch (error) {
    console.error("Vet authentication error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
}; 