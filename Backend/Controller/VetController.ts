import { Request, Response } from "express";
import { prisma } from "./prisma";
import { redis } from "./redis";
import { Prisma } from "@prisma/client";

interface WorkingHoursInput {
  day_of_week: number;
  start_time: Date;
  end_time: Date;
  is_available?: boolean;
}

// Create Vet with working hours and clinic association
export const CreateVet = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, license_id, specialty, clinic_id, workingHours } = req.body;

    // Check if vet already exists
    const existingVet = await prisma.vet.findFirst({
      where: { 
        OR: [
          { username },
          { email }
        ]
      },
    });

    if (existingVet) {
      res.status(400).json({
        message: "Vet with this username or email already exists",
      });
      return;
    }

    
    

    // Use a transaction to create vet and related data
    const result = await prisma.$transaction(async (tx) => {
      // Create vet
      const vet = await tx.vet.create({
        data: {
          username,
          email,
          password, // Note: Password should be hashed before this point
          license_id,
          specialty,
          clinic_id,
        },
        include: {
          clinic: true,
        },
      });

      // Create working hours if provided
      if (workingHours && workingHours.length > 0) {
        // Check for duplicate days
        const days = workingHours.map((wh: WorkingHoursInput) => wh.day_of_week);
        const uniqueDays = new Set(days);
        if (days.length !== uniqueDays.size) {
          throw new Error("Duplicate days found in working hours");
        }

        // Create working hours
        await tx.workingHours.createMany({
          data: workingHours.map((wh: WorkingHoursInput) => ({
            vet_id: vet.vet_id,
            day_of_week: wh.day_of_week,
            start_time: wh.start_time,
            end_time: wh.end_time,
            is_available: wh.is_available ?? true,
          })),
        });
      }

      // Fetch the complete vet with all components
      return await tx.vet.findUnique({
        where: { vet_id: vet.vet_id },
        include: {
          clinic: true,
          WorkingHours: true,
        },
      });
    });

    if (!result) {
      throw new Error("Failed to create vet");
    }

    // Invalidate cache
    await redis.del(`vet:${result.vet_id}`);

    res.status(201).json({
      message: "Vet and related components created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error creating vet:", error);
    res.status(500).json({
      message: "Error creating vet",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get Vet with all components
export async function GetVet(
  req: Request<{ vet_id: string }>,
  res: Response
): Promise<void> {
  try {
    const vet_id = parseInt(req.params.vet_id, 10);

    if (isNaN(vet_id)) {
      res.status(400).json({ message: "Invalid vet ID" });
      return;
    }

    // Try to get from cache first
    const cacheKey = `vet:${vet_id}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      res.status(200).json(JSON.parse(cachedData));
      return;
    }

    const vet = await prisma.vet.findUnique({
      where: { vet_id },
      include: {
        clinic: true,
        WorkingHours: true,
        Appointments: {
          include: {
            pet: true,
          },
        },
      },
    });

    if (!vet) {
      res.status(404).json({ message: "Vet not found" });
      return;
    }

    // Cache the response
    await redis.setEx(cacheKey, 3600, JSON.stringify(vet));

    res.status(200).json(vet);
  } catch (error) {
    console.error("Error retrieving vet:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Update Vet and its components
export async function UpdateVet(
  req: Request<{ vet_id: string }, {}, {
    username?: string;
    email?: string;
    password?: string;
    license_id?: string;
    specialty?: string;
    clinic_id?: number;
    workingHours?: Array<{
      day_of_week: number;
      start_time: Date;
      end_time: Date;
      is_available?: boolean;
    }>;
  }>,
  res: Response
): Promise<void> {
  try {
    const vet_id = parseInt(req.params.vet_id, 10);
    const { username, email, password, license_id, specialty, clinic_id, workingHours } = req.body;

    if (isNaN(vet_id)) {
      res.status(400).json({ message: "Invalid vet ID" });
      return;
    }

    const existingVet = await prisma.vet.findUnique({
      where: { vet_id },
    });

    if (!existingVet) {
      res.status(404).json({ message: "Vet not found" });
      return;
    }

    // Use a transaction to update vet and related data
    const result = await prisma.$transaction(async (tx) => {
      // Update vet
      const updatedVet = await tx.vet.update({
        where: { vet_id },
        data: {
          username,
          email,
          password, // Note: Password should be hashed before this point
          license_id,
          specialty,
          clinic_id,
        },
        include: {
          clinic: true,
        },
      });

      // Update working hours if provided
      if (workingHours) {
        // Delete existing working hours
        await tx.workingHours.deleteMany({
          where: { vet_id },
        });

        // Check for duplicate days
        const days = workingHours.map(wh => wh.day_of_week);
        const uniqueDays = new Set(days);
        if (days.length !== uniqueDays.size) {
          throw new Error("Duplicate days found in working hours");
        }

        // Create new working hours
        await tx.workingHours.createMany({
          data: workingHours.map(wh => ({
            vet_id,
            day_of_week: wh.day_of_week,
            start_time: wh.start_time,
            end_time: wh.end_time,
            is_available: wh.is_available ?? true,
          })),
        });
      }

      // Fetch the complete updated vet
      return await tx.vet.findUnique({
        where: { vet_id },
        include: {
          clinic: true,
          WorkingHours: true,
          Appointments: {
            include: {
              pet: true,
            },
          },
        },
      });
    });

    // Invalidate cache
    await redis.del(`vet:${vet_id}`);

    res.status(200).json({
      message: "Vet and components updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error updating vet:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Vet and all related data
export async function DeleteVet(
  req: Request<{ vet_id: string }>,
  res: Response
): Promise<void> {
  try {
    const vet_id = parseInt(req.params.vet_id, 10);

    if (isNaN(vet_id)) {
      res.status(400).json({ message: "Invalid vet ID" });
      return;
    }

    const existingVet = await prisma.vet.findUnique({
      where: { vet_id },
    });

    if (!existingVet) {
      res.status(404).json({ message: "Vet not found" });
      return;
    }

    // Check for existing appointments
    const appointments = await prisma.appointment.findMany({
      where: { vet_id },
    });

    if (appointments.length > 0) {
      res.status(400).json({
        message: "Cannot delete vet with existing appointments. Please handle appointments first.",
      });
      return;
    }

    // Use a transaction to delete all related data
    await prisma.$transaction(async (tx) => {
      // Delete working hours
      await tx.workingHours.deleteMany({
        where: { vet_id },
      });

      // Delete vet
      await tx.vet.delete({
        where: { vet_id },
      });
    });

    // Invalidate cache
    await redis.del(`vet:${vet_id}`);

    res.status(200).json({ message: "Vet and all related data deleted successfully" });
  } catch (error) {
    console.error("Error deleting vet:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
