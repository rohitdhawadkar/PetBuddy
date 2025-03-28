import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../Controller/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface AdminTokenPayload {
  admin_id: number;
  is_active: boolean;
}

declare global {
  namespace Express {
    interface Request {
      admin?: AdminTokenPayload;
    }
  }
}

export const adminAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as AdminTokenPayload;

    // Check if admin exists and is active
    const admin = await prisma.admin.findUnique({
      where: { admin_id: decoded.admin_id },
      select: {
        admin_id: true,
        is_active: true,
      },
    });

    if (!admin) {
      res.status(401).json({ message: 'Admin not found' });
      return;
    }

    if (!admin.is_active) {
      res.status(403).json({ message: 'Admin account is inactive' });
      return;
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error('Admin authentication error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
}; 