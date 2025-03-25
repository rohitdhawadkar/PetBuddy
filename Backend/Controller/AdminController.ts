import { Request, Response } from "express";
import { prisma } from "./prisma";
import { redis } from "./redis";
import bcrypt from "bcrypt";
import { CreateAdminInput, UpdateAdminInput, AdminIdParam } from "../Validation/AdminSchema";

// Create Admin
export const CreateAdmin = async (
  req: Request<{}, {}, CreateAdminInput>,
  res: Response
): Promise<void> => {
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
    console.error("Error creating admin:", error);
    res.status(500).json({
      message: "Error creating admin",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get Admin by ID
export const GetAdmin = async (
  req: Request<AdminIdParam>,
  res: Response
): Promise<void> => {
  try {
    const admin_id = parseInt(req.params.admin_id, 10);

    if (isNaN(admin_id)) {
      res.status(400).json({ message: "Invalid admin ID" });
      return;
    }

    // Try to get from cache first
    const cacheKey = `admin:${admin_id}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      res.status(200).json(JSON.parse(cachedData));
      return;
    }

    const admin = await prisma.admin.findUnique({
      where: { admin_id },
      select: {
        admin_id: true,
        username: true,
        email: true,
        first_name: true,
        last_name: true,
        phone: true,
        is_active: true,
        last_login: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!admin) {
      res.status(404).json({ message: "Admin not found" });
      return;
    }

    // Cache the response
    await redis.setEx(cacheKey, 3600, JSON.stringify(admin));

    res.status(200).json(admin);
  } catch (error) {
    console.error("Error retrieving admin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all Admins
export const GetAllAdmins = async (req: Request, res: Response): Promise<void> => {
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
        last_login: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    // Cache the response
    await redis.setEx(cacheKey, 3600, JSON.stringify(admins));

    res.status(200).json(admins);
  } catch (error) {
    console.error("Error retrieving admins:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update Admin
export const UpdateAdmin = async (
  req: Request<AdminIdParam, {}, UpdateAdminInput>,
  res: Response
): Promise<void> => {
  try {
    const admin_id = parseInt(req.params.admin_id, 10);
    const {
      username,
      email,
      password,
      first_name,
      last_name,
      phone,
      is_active,
    } = req.body;

    if (isNaN(admin_id)) {
      res.status(400).json({ message: "Invalid admin ID" });
      return;
    }

    const existingAdmin = await prisma.admin.findUnique({
      where: { admin_id },
    });

    if (!existingAdmin) {
      res.status(404).json({ message: "Admin not found" });
      return;
    }

    // Check for duplicate username/email if being updated
    if (username || email) {
      const duplicateAdmin = await prisma.admin.findFirst({
        where: {
          admin_id: { not: admin_id },
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
      where: { admin_id },
      data: updateData,
      select: {
        admin_id: true,
        username: true,
        email: true,
        first_name: true,
        last_name: true,
        phone: true,
        is_active: true,
        last_login: true,
        created_at: true,
        updated_at: true,
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
    console.error("Error updating admin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete Admin
export const DeleteAdmin = async (
  req: Request<AdminIdParam>,
  res: Response
): Promise<void> => {
  try {
    const admin_id = parseInt(req.params.admin_id, 10);

    if (isNaN(admin_id)) {
      res.status(400).json({ message: "Invalid admin ID" });
      return;
    }

    const existingAdmin = await prisma.admin.findUnique({
      where: { admin_id },
    });

    if (!existingAdmin) {
      res.status(404).json({ message: "Admin not found" });
      return;
    }

    await prisma.admin.delete({
      where: { admin_id },
    });

    // Invalidate cache
    await redis.del(`admin:${admin_id}`);
    await redis.del("all_admins");

    res.status(200).json({
      message: "Admin deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting admin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}; 