import { Request, Response, NextFunction } from 'express';
import { prisma } from "./prisma";
import { redis } from "./redis";
import bcrypt from "bcrypt";
import { CreateAdminInput, UpdateAdminInput, AdminIdParam, AdminLoginInput } from "../Validation/AdminSchema";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Create Admin
export const CreateAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, email, password, first_name, last_name, phone } = req.body;

    // Check if username or email already exists
    const existingAdmin = await prisma.admin.findFirst({
      where: {
        OR: [
          { username },
          { email },
        ],
      },
    });

    if (existingAdmin) {
      res.status(400).json({ message: "Username or email already exists" });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = await prisma.admin.create({
      data: {
        username,
        email,
        password: hashedPassword,
        first_name,
        last_name,
        phone,
      },
    });

    // Invalidate cache
    await redis.del("all_admins");

    res.status(201).json({
      message: "Admin created successfully",
      data: {
        admin_id: admin.admin_id,
        username: admin.username,
        email: admin.email,
        first_name: admin.first_name,
        last_name: admin.last_name,
        phone: admin.phone,
        is_active: admin.is_active,
        created_at: admin.created_at,
        updated_at: admin.updated_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get Admin by ID
export const GetAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { admin_id } = req.params;
    const admin = await prisma.admin.findUnique({
      where: { admin_id: parseInt(admin_id) },
      select: {
        admin_id: true,
        username: true,
        email: true,
        first_name: true,
        last_name: true,
        phone: true,
        is_active: true,
      },
    });

    if (!admin) {
      res.status(404).json({ message: 'Admin not found' });
      return;
    }

    res.json(admin);
  } catch (error) {
    next(error);
  }
};

// Get all Admins
export const GetAllAdmins = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Try to get from cache first
    const cacheKey = "all_admins";
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      res.status(200).json(JSON.parse(cachedData));
      return;
    }

    const admins = await prisma.admin.findMany({
      select: {
        admin_id: true,
        username: true,
        email: true,
        first_name: true,
        last_name: true,
        phone: true,
        is_active: true,
      },
    });

    // Cache the response
    await redis.setEx(cacheKey, 3600, JSON.stringify(admins));

    res.status(200).json(admins);
  } catch (error) {
    next(error);
  }
};

// Update Admin
export const UpdateAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { admin_id } = req.params;
    const {
      username,
      email,
      password,
      first_name,
      last_name,
      phone,
      is_active,
    } = req.body;

    if (isNaN(parseInt(admin_id))) {
      res.status(400).json({ message: "Invalid admin ID" });
      return;
    }

    const existingAdmin = await prisma.admin.findUnique({
      where: { admin_id: parseInt(admin_id) },
    });

    if (!existingAdmin) {
      res.status(404).json({ message: "Admin not found" });
      return;
    }

    // Check for duplicate username/email if being updated
    if (username || email) {
      const duplicateAdmin = await prisma.admin.findFirst({
        where: {
          admin_id: { not: parseInt(admin_id) },
          OR: [
            { username: username || undefined },
            { email: email || undefined },
          ],
        },
      });

      if (duplicateAdmin) {
        res.status(400).json({ message: "Username or email already exists" });
        return;
      }
    }

    // Prepare update data
    const updateData: any = {
      ...(username && { username }),
      ...(email && { email }),
      ...(first_name && { first_name }),
      ...(last_name && { last_name }),
      ...(phone !== undefined && { phone }),
      ...(is_active !== undefined && { is_active }),
    };

    // Hash password if being updated
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Update admin
    const updatedAdmin = await prisma.admin.update({
      where: { admin_id: parseInt(admin_id) },
      data: updateData,
      select: {
        admin_id: true,
        username: true,
        email: true,
        first_name: true,
        last_name: true,
        phone: true,
        is_active: true,
      },
    });

    // Invalidate cache
    await redis.del(`admin:${admin_id}`);
    await redis.del("all_admins");

    res.status(200).json({
      message: "Admin updated successfully",
      data: updatedAdmin,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Admin
export const DeleteAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { admin_id } = req.params;
    await prisma.admin.delete({
      where: { admin_id: parseInt(admin_id) },
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const AdminLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, password } = req.body as AdminLoginInput;

    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { admin_id: admin.admin_id, is_active: admin.is_active },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password: _, ...adminData } = admin;
    res.json({ token, admin: adminData });
  } catch (error) {
    next(error);
  }
};

export const GetAdminStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [totalUsers, totalPets, totalVets, totalAppointments] = await Promise.all([
      prisma.user.count(),
      prisma.pet.count(),
      prisma.vet.count(),
      prisma.appointment.count(),
    ]);

    res.json({
      totalUsers,
      totalPets,
      totalVets,
      totalAppointments,
    });
  } catch (error) {
    next(error);
  }
};

// Get all users with their pets and health trackers
export const GetAllUsersWithDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      include: {
        pets: {
          include: {
            PetProfile: {
              include: {
                HealthTracker: {
                  include: {
                    WeightTracking: true,
                    MedicalRecord: {
                      include: {
                        Vet: true
                      }
                    },
                    DietPlan: true
                  }
                }
              }
            }
          }
        }
      }
    });

    res.json(users);
  } catch (error) {
    next(error);
  }
};

// Get all vets with their clinics
export const GetAllVetsWithClinics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const vets = await prisma.vet.findMany({
      include: {
        clinic: true,
        WorkingHours: true
      }
    });

    res.json(vets);
  } catch (error) {
    next(error);
  }
};

// Get all trainers with their styles and working hours
export const GetAllTrainersWithDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const trainers = await prisma.trainer.findMany({
      include: {
        TrainingStyle: true,
        WorkingHours: true,
        Sessions: {
          include: {
            pet: true
          }
        },
        Progress: {
          include: {
            pet: true
          }
        }
      }
    });

    res.json(trainers);
  } catch (error) {
    next(error);
  }
}; 