import { Request, Response } from "express";
import { prisma } from "./prisma";
import { redis } from "./redis";

// Create Working Hours
export const CreateWorkingHours = async (req: Request, res: Response): Promise<void> => {
  try {
    const { trainer_id, day_of_week, start_time, end_time, is_available } = req.body;

    // Check if trainer exists
    const trainer = await prisma.trainer.findUnique({
      where: { trainer_id },
    });

    if (!trainer) {
      res.status(404).json({ message: "Trainer not found" });
      return;
    }

    // Check for duplicate day entry
    const existingHours = await prisma.trainerWorkingHours.findUnique({
      where: {
        trainer_id_day_of_week: {
          trainer_id,
          day_of_week,
        },
      },
    });

    if (existingHours) {
      res.status(400).json({ message: "Working hours already exist for this day" });
      return;
    }

    // Create working hours
    const workingHours = await prisma.trainerWorkingHours.create({
      data: {
        trainer_id,
        day_of_week,
        start_time,
        end_time,
        is_available,
      },
      include: {
        trainer: true,
      },
    });

    // Invalidate cache
    await redis.del(`trainer_working_hours:${trainer_id}`);

    res.status(201).json({
      message: "Working hours created successfully",
      data: workingHours,
    });
  } catch (error) {
    console.error("Error creating working hours:", error);
    res.status(500).json({
      message: "Error creating working hours",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get Working Hours by ID
export const GetWorkingHours = async (
  req: Request<{ working_hours_id: string }>,
  res: Response
): Promise<void> => {
  try {
    const working_hours_id = parseInt(req.params.working_hours_id, 10);

    if (isNaN(working_hours_id)) {
      res.status(400).json({ message: "Invalid working hours ID" });
      return;
    }

    // Try to get from cache first
    const cacheKey = `working_hours:${working_hours_id}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      res.status(200).json(JSON.parse(cachedData));
      return;
    }

    const workingHours = await prisma.trainerWorkingHours.findUnique({
      where: { working_hours_id },
      include: {
        trainer: true,
      },
    });

    if (!workingHours) {
      res.status(404).json({ message: "Working hours not found" });
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

// Get all working hours for a trainer
export const GetTrainerWorkingHours = async (
  req: Request<{ trainer_id: string }>,
  res: Response
): Promise<void> => {
  try {
    const trainer_id = parseInt(req.params.trainer_id, 10);

    if (isNaN(trainer_id)) {
      res.status(400).json({ message: "Invalid trainer ID" });
      return;
    }

    // Try to get from cache first
    const cacheKey = `trainer_working_hours:${trainer_id}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      res.status(200).json(JSON.parse(cachedData));
      return;
    }

    const workingHours = await prisma.trainerWorkingHours.findMany({
      where: { trainer_id },
      include: {
        trainer: true,
      },
      orderBy: {
        day_of_week: 'asc',
      },
    });

    // Cache the response
    await redis.setEx(cacheKey, 3600, JSON.stringify(workingHours));

    res.status(200).json(workingHours);
  } catch (error) {
    console.error("Error retrieving trainer working hours:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update Working Hours
export const UpdateWorkingHours = async (
  req: Request<{ working_hours_id: string }>,
  res: Response
): Promise<void> => {
  try {
    const working_hours_id = parseInt(req.params.working_hours_id, 10);
    const { day_of_week, start_time, end_time, is_available } = req.body;

    if (isNaN(working_hours_id)) {
      res.status(400).json({ message: "Invalid working hours ID" });
      return;
    }

    const existingHours = await prisma.trainerWorkingHours.findUnique({
      where: { working_hours_id },
    });

    if (!existingHours) {
      res.status(404).json({ message: "Working hours not found" });
      return;
    }

    // Check for duplicate day entry if day is being updated
    if (day_of_week !== undefined && day_of_week !== existingHours.day_of_week) {
      const duplicateHours = await prisma.trainerWorkingHours.findUnique({
        where: {
          trainer_id_day_of_week: {
            trainer_id: existingHours.trainer_id,
            day_of_week,
          },
        },
      });

      if (duplicateHours) {
        res.status(400).json({ message: "Working hours already exist for this day" });
        return;
      }
    }

    // Update working hours
    const updatedHours = await prisma.trainerWorkingHours.update({
      where: { working_hours_id },
      data: {
        day_of_week,
        start_time,
        end_time,
        is_available,
      },
      include: {
        trainer: true,
      },
    });

    // Invalidate cache
    await redis.del(`working_hours:${working_hours_id}`);
    await redis.del(`trainer_working_hours:${existingHours.trainer_id}`);

    res.status(200).json({
      message: "Working hours updated successfully",
      data: updatedHours,
    });
  } catch (error) {
    console.error("Error updating working hours:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete Working Hours
export const DeleteWorkingHours = async (
  req: Request<{ working_hours_id: string }>,
  res: Response
): Promise<void> => {
  try {
    const working_hours_id = parseInt(req.params.working_hours_id, 10);

    if (isNaN(working_hours_id)) {
      res.status(400).json({ message: "Invalid working hours ID" });
      return;
    }

    const existingHours = await prisma.trainerWorkingHours.findUnique({
      where: { working_hours_id },
    });

    if (!existingHours) {
      res.status(404).json({ message: "Working hours not found" });
      return;
    }

    // Delete working hours
    await prisma.trainerWorkingHours.delete({
      where: { working_hours_id },
    });

    // Invalidate cache
    await redis.del(`working_hours:${working_hours_id}`);
    await redis.del(`trainer_working_hours:${existingHours.trainer_id}`);

    res.status(200).json({ message: "Working hours deleted successfully" });
  } catch (error) {
    console.error("Error deleting working hours:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}; 