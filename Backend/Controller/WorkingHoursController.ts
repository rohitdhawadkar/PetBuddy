import { Request, Response } from "express";
import { prisma } from "./prisma";
import { redis } from "./redis";

interface WorkingHoursInput {
  day_of_week: number;
  start_time: string | Date;
  end_time: string | Date;
  is_available?: boolean;
}

// Create working hours
export const CreateWorkingHours = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      vet_id,
      workingHours,
    }: { vet_id: number; workingHours: WorkingHoursInput[] } = req.body;

    // Check if vet exists
    const vet = await prisma.vet.findUnique({
      where: { vet_id },
    });

    if (!vet) {
      res.status(404).json({ message: "Vet not found" });
      return;
    }

    // Check for duplicate days
    const uniqueDays = new Set(workingHours.map((wh) => wh.day_of_week));
    if (uniqueDays.size !== workingHours.length) {
      res
        .status(400)
        .json({ message: "Duplicate days found in working hours" });
      return;
    }

    // Check for existing working hours
    const existingHours = await prisma.workingHours.findMany({
      where: {
        vet_id,
        day_of_week: { in: Array.from(uniqueDays) },
      },
    });

    if (existingHours.length > 0) {
      res.status(400).json({
        message: "Working hours already exist for some days",
        conflicting_days: existingHours.map(
          (h: { day_of_week: number }) => h.day_of_week,
        ),
      });
      return;
    }

    const createdHours = await prisma.workingHours.createMany({
      data: workingHours.map((hours) => ({
        vet_id,
        day_of_week: hours.day_of_week,
        start_time: new Date(hours.start_time),
        end_time: new Date(hours.end_time),
        is_available: hours.is_available ?? true,
      })),
    });

    // Cache the working hours for this vet
    const allHours = await prisma.workingHours.findMany({
      where: { vet_id },
    });
    await redis.setEx(
      `working_hours:vet:${vet_id}`,
      3600,
      JSON.stringify(allHours),
    );

    res.status(201).json({
      message: "Working hours created successfully",
      count: createdHours.count,
    });
  } catch (error) {
    console.error("Error creating working hours:", error);
    res.status(500).json({
      message: "Error creating working hours",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get working hours by vet ID
export const GetVetWorkingHours = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const vet_id = parseInt(req.params.vet_id, 10);

    if (isNaN(vet_id)) {
      res.status(400).json({ message: "Invalid vet ID" });
      return;
    }

    // Try to get from cache first
    const cacheKey = `working_hours:vet:${vet_id}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      res.status(200).json(JSON.parse(cachedData));
      return;
    }

    const workingHours = await prisma.workingHours.findMany({
      where: { vet_id },
      orderBy: { day_of_week: "asc" },
    });

    if (workingHours.length === 0) {
      res.status(404).json({ message: "No working hours found for this vet" });
      return;
    }

    // Cache the response
    await redis.setEx(cacheKey, 3600, JSON.stringify(workingHours));

    res.status(200).json(workingHours);
  } catch (error) {
    console.error("Error retrieving working hours:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update working hours for a specific day
export const UpdateWorkingHours = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const working_hours_id = parseInt(req.params.working_hours_id, 10);
    const { start_time, end_time, is_available } = req.body;

    if (isNaN(working_hours_id)) {
      res.status(400).json({ message: "Invalid working hours ID" });
      return;
    }

    const existingHours = await prisma.workingHours.findUnique({
      where: { working_hours_id },
    });

    if (!existingHours) {
      res.status(404).json({ message: "Working hours not found" });
      return;
    }

    const updatedHours = await prisma.workingHours.update({
      where: { working_hours_id },
      data: {
        start_time: start_time ? new Date(start_time) : undefined,
        end_time: end_time ? new Date(end_time) : undefined,
        is_available: is_available,
      },
    });

    // Invalidate cache for this vet's working hours
    await redis.del(`working_hours:vet:${updatedHours.vet_id}`);

    res.status(200).json({
      message: "Working hours updated successfully",
      data: updatedHours,
    });
  } catch (error) {
    console.error("Error updating working hours:", error);
    res.status(500).json({
      message: "Error updating working hours",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Delete working hours
export const DeleteWorkingHours = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const working_hours_id = parseInt(req.params.working_hours_id, 10);

    if (isNaN(working_hours_id)) {
      res.status(400).json({ message: "Invalid working hours ID" });
      return;
    }

    const existingHours = await prisma.workingHours.findUnique({
      where: { working_hours_id },
    });

    if (!existingHours) {
      res.status(404).json({ message: "Working hours not found" });
      return;
    }

    await prisma.workingHours.delete({
      where: { working_hours_id },
    });

    // Invalidate cache for this vet's working hours
    await redis.del(`working_hours:vet:${existingHours.vet_id}`);

    res.status(200).json({
      message: "Working hours deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting working hours:", error);
    res.status(500).json({
      message: "Error deleting working hours",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
