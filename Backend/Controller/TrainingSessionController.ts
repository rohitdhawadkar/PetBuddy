import { Request, Response } from "express";
import { prisma } from "./prisma";
import { redis } from "./redis";
import { Prisma } from "@prisma/client";

// Create Training Session
export const CreateTrainingSession = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      trainer_id,
      pet_id,
      session_date,
      start_time,
      end_time,
      session_type,
      focus_areas,
      notes,
    } = req.body;

    // Check if trainer exists
    const trainer = await prisma.trainer.findUnique({
      where: { trainer_id },
    });

    if (!trainer) {
      res.status(404).json({ message: "Trainer not found" });
      return;
    }

    // Check if pet exists
    const pet = await prisma.pet.findUnique({
      where: { pet_id },
    });

    if (!pet) {
      res.status(404).json({ message: "Pet not found" });
      return;
    }

    // Check for scheduling conflicts
    const existingSession = await prisma.trainingSession.findFirst({
      where: {
        trainer_id,
        session_date,
        OR: [
          {
            AND: [
              { start_time: { lte: start_time } },
              { end_time: { gt: start_time } },
            ],
          },
          {
            AND: [
              { start_time: { lt: end_time } },
              { end_time: { gte: end_time } },
            ],
          },
        ],
      },
    });

    if (existingSession) {
      res.status(400).json({
        message: "Time slot is already booked for this trainer",
      });
      return;
    }

    // Create training session
    const session = await prisma.trainingSession.create({
      data: {
        trainer_id,
        pet_id,
        session_date,
        start_time,
        end_time,
        session_type,
        focus_areas,
        notes,
        status: "SCHEDULED",
      },
      include: {
        trainer: true,
        pet: true,
      },
    });

    // Invalidate cache
    await redis.del(`trainer_sessions:${trainer_id}`);
    await redis.del(`pet_sessions:${pet_id}`);

    res.status(201).json({
      message: "Training session created successfully",
      data: session,
    });
  } catch (error) {
    console.error("Error creating training session:", error);
    res.status(500).json({
      message: "Error creating training session",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get Training Session by ID
export const GetTrainingSession = async (
  req: Request<{ session_id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const session_id = parseInt(req.params.session_id, 10);

    if (isNaN(session_id)) {
      res.status(400).json({ message: "Invalid session ID" });
      return;
    }

    // Try to get from cache first
    const cacheKey = `session:${session_id}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      res.status(200).json(JSON.parse(cachedData));
      return;
    }

    const session = await prisma.trainingSession.findUnique({
      where: { session_id },
      include: {
        trainer: true,
        pet: true,
      },
    });

    if (!session) {
      res.status(404).json({ message: "Training session not found" });
      return;
    }

    // Cache the response
    await redis.setEx(cacheKey, 3600, JSON.stringify(session));

    res.status(200).json(session);
  } catch (error) {
    console.error("Error retrieving training session:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all sessions for a trainer
export const GetTrainerSessions = async (
  req: Request<{ trainer_id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const trainer_id = parseInt(req.params.trainer_id, 10);

    if (isNaN(trainer_id)) {
      res.status(400).json({ message: "Invalid trainer ID" });
      return;
    }

    // Try to get from cache first
    const cacheKey = `trainer_sessions:${trainer_id}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      res.status(200).json(JSON.parse(cachedData));
      return;
    }

    const sessions = await prisma.trainingSession.findMany({
      where: { trainer_id },
      include: {
        trainer: true,
        pet: true,
      },
      orderBy: {
        session_date: "asc",
      },
    });

    // Cache the response
    await redis.setEx(cacheKey, 3600, JSON.stringify(sessions));

    res.status(200).json(sessions);
  } catch (error) {
    console.error("Error retrieving trainer sessions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update Training Session
export const UpdateTrainingSession = async (
  req: Request<{ session_id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const session_id = parseInt(req.params.session_id, 10);
    const {
      session_date,
      start_time,
      end_time,
      status,
      session_type,
      focus_areas,
      notes,
      progress_notes,
    } = req.body;

    if (isNaN(session_id)) {
      res.status(400).json({ message: "Invalid session ID" });
      return;
    }

    const existingSession = await prisma.trainingSession.findUnique({
      where: { session_id },
    });

    if (!existingSession) {
      res.status(404).json({ message: "Training session not found" });
      return;
    }

    // Check for scheduling conflicts if time is being updated
    if (session_date || start_time || end_time) {
      const conflictSession = await prisma.trainingSession.findFirst({
        where: {
          trainer_id: existingSession.trainer_id,
          session_id: { not: session_id },
          session_date: session_date || existingSession.session_date,
          OR: [
            {
              AND: [
                {
                  start_time: { lte: start_time || existingSession.start_time },
                },
                { end_time: { gt: start_time || existingSession.start_time } },
              ],
            },
            {
              AND: [
                { start_time: { lt: end_time || existingSession.end_time } },
                { end_time: { gte: end_time || existingSession.end_time } },
              ],
            },
          ],
        },
      });

      if (conflictSession) {
        res.status(400).json({
          message: "Time slot is already booked for this trainer",
        });
        return;
      }
    }

    // Update session
    const updatedSession = await prisma.trainingSession.update({
      where: { session_id },
      data: {
        session_date,
        start_time,
        end_time,
        status,
        session_type,
        focus_areas,
        notes,
        progress_notes,
      },
      include: {
        trainer: true,
        pet: true,
      },
    });

    // Invalidate cache
    await redis.del(`session:${session_id}`);
    await redis.del(`trainer_sessions:${existingSession.trainer_id}`);
    await redis.del(`pet_sessions:${existingSession.pet_id}`);

    res.status(200).json({
      message: "Training session updated successfully",
      data: updatedSession,
    });
  } catch (error) {
    console.error("Error updating training session:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete Training Session
export const DeleteTrainingSession = async (
  req: Request<{ session_id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const session_id = parseInt(req.params.session_id, 10);

    if (isNaN(session_id)) {
      res.status(400).json({ message: "Invalid session ID" });
      return;
    }

    const existingSession = await prisma.trainingSession.findUnique({
      where: { session_id },
    });

    if (!existingSession) {
      res.status(404).json({ message: "Training session not found" });
      return;
    }

    // Check if session can be deleted (not in progress or completed)
    if (
      existingSession.status === "IN_PROGRESS" ||
      existingSession.status === "COMPLETED"
    ) {
      res.status(400).json({
        message: "Cannot delete a session that is in progress or completed",
      });
      return;
    }

    // Delete session
    await prisma.trainingSession.delete({
      where: { session_id },
    });

    // Invalidate cache
    await redis.del(`session:${session_id}`);
    await redis.del(`trainer_sessions:${existingSession.trainer_id}`);
    await redis.del(`pet_sessions:${existingSession.pet_id}`);

    res.status(200).json({ message: "Training session deleted successfully" });
  } catch (error) {
    console.error("Error deleting training session:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
