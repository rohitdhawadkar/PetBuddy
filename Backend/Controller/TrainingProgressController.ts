import { Request, Response } from "express";
import { prisma } from "./prisma";
import { redis } from "./redis";

// Create Training Progress
export const CreateTrainingProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      trainer_id,
      pet_id,
      skill_name,
      current_level,
      target_level,
      last_assessed,
      assessment_notes,
      next_steps,
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

    // Check for duplicate skill entry
    const existingProgress = await prisma.trainingProgress.findUnique({
      where: {
        trainer_id_pet_id_skill_name: {
          trainer_id,
          pet_id,
          skill_name,
        },
      },
    });

    if (existingProgress) {
      res.status(400).json({ message: "Progress already exists for this skill" });
      return;
    }

    // Validate skill levels
    if (current_level < 1 || current_level > 5 || target_level < 1 || target_level > 5) {
      res.status(400).json({ message: "Skill levels must be between 1 and 5" });
      return;
    }

    // Create training progress
    const progress = await prisma.trainingProgress.create({
      data: {
        trainer_id,
        pet_id,
        skill_name,
        current_level,
        target_level,
        last_assessed,
        assessment_notes,
        next_steps,
      },
      include: {
        trainer: true,
        pet: true,
      },
    });

    // Invalidate cache
    await redis.del(`trainer_progress:${trainer_id}`);
    await redis.del(`pet_progress:${pet_id}`);

    res.status(201).json({
      message: "Training progress created successfully",
      data: progress,
    });
  } catch (error) {
    console.error("Error creating training progress:", error);
    res.status(500).json({
      message: "Error creating training progress",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get Training Progress by ID
export const GetTrainingProgress = async (
  req: Request<{ progress_id: string }>,
  res: Response
): Promise<void> => {
  try {
    const progress_id = parseInt(req.params.progress_id, 10);

    if (isNaN(progress_id)) {
      res.status(400).json({ message: "Invalid progress ID" });
      return;
    }

    // Try to get from cache first
    const cacheKey = `progress:${progress_id}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      res.status(200).json(JSON.parse(cachedData));
      return;
    }

    const progress = await prisma.trainingProgress.findUnique({
      where: { progress_id },
      include: {
        trainer: true,
        pet: true,
      },
    });

    if (!progress) {
      res.status(404).json({ message: "Training progress not found" });
      return;
    }

    // Cache the response
    await redis.setEx(cacheKey, 3600, JSON.stringify(progress));

    res.status(200).json(progress);
  } catch (error) {
    console.error("Error retrieving training progress:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all progress for a trainer
export const GetTrainerProgress = async (
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
    const cacheKey = `trainer_progress:${trainer_id}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      res.status(200).json(JSON.parse(cachedData));
      return;
    }

    const progress = await prisma.trainingProgress.findMany({
      where: { trainer_id },
      include: {
        trainer: true,
        pet: true,
      },
      orderBy: {
        last_assessed: 'desc',
      },
    });

    // Cache the response
    await redis.setEx(cacheKey, 3600, JSON.stringify(progress));

    res.status(200).json(progress);
  } catch (error) {
    console.error("Error retrieving trainer progress:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all progress for a pet
export const GetPetProgress = async (
  req: Request<{ pet_id: string }>,
  res: Response
): Promise<void> => {
  try {
    const pet_id = parseInt(req.params.pet_id, 10);

    if (isNaN(pet_id)) {
      res.status(400).json({ message: "Invalid pet ID" });
      return;
    }

    // Try to get from cache first
    const cacheKey = `pet_progress:${pet_id}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      res.status(200).json(JSON.parse(cachedData));
      return;
    }

    const progress = await prisma.trainingProgress.findMany({
      where: { pet_id },
      include: {
        trainer: true,
        pet: true,
      },
      orderBy: {
        last_assessed: 'desc',
      },
    });

    // Cache the response
    await redis.setEx(cacheKey, 3600, JSON.stringify(progress));

    res.status(200).json(progress);
  } catch (error) {
    console.error("Error retrieving pet progress:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update Training Progress
export const UpdateTrainingProgress = async (
  req: Request<{ progress_id: string }>,
  res: Response
): Promise<void> => {
  try {
    const progress_id = parseInt(req.params.progress_id, 10);
    const {
      current_level,
      target_level,
      last_assessed,
      assessment_notes,
      next_steps,
    } = req.body;

    if (isNaN(progress_id)) {
      res.status(400).json({ message: "Invalid progress ID" });
      return;
    }

    const existingProgress = await prisma.trainingProgress.findUnique({
      where: { progress_id },
    });

    if (!existingProgress) {
      res.status(404).json({ message: "Training progress not found" });
      return;
    }

    // Validate skill levels if being updated
    if (current_level !== undefined && (current_level < 1 || current_level > 5)) {
      res.status(400).json({ message: "Current level must be between 1 and 5" });
      return;
    }

    if (target_level !== undefined && (target_level < 1 || target_level > 5)) {
      res.status(400).json({ message: "Target level must be between 1 and 5" });
      return;
    }

    // Update progress
    const updatedProgress = await prisma.trainingProgress.update({
      where: { progress_id },
      data: {
        current_level,
        target_level,
        last_assessed,
        assessment_notes,
        next_steps,
      },
      include: {
        trainer: true,
        pet: true,
      },
    });

    // Invalidate cache
    await redis.del(`progress:${progress_id}`);
    await redis.del(`trainer_progress:${existingProgress.trainer_id}`);
    await redis.del(`pet_progress:${existingProgress.pet_id}`);

    res.status(200).json({
      message: "Training progress updated successfully",
      data: updatedProgress,
    });
  } catch (error) {
    console.error("Error updating training progress:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete Training Progress
export const DeleteTrainingProgress = async (
  req: Request<{ progress_id: string }>,
  res: Response
): Promise<void> => {
  try {
    const progress_id = parseInt(req.params.progress_id, 10);

    if (isNaN(progress_id)) {
      res.status(400).json({ message: "Invalid progress ID" });
      return;
    }

    const existingProgress = await prisma.trainingProgress.findUnique({
      where: { progress_id },
    });

    if (!existingProgress) {
      res.status(404).json({ message: "Training progress not found" });
      return;
    }

    // Delete progress
    await prisma.trainingProgress.delete({
      where: { progress_id },
    });

    // Invalidate cache
    await redis.del(`progress:${progress_id}`);
    await redis.del(`trainer_progress:${existingProgress.trainer_id}`);
    await redis.del(`pet_progress:${existingProgress.pet_id}`);

    res.status(200).json({ message: "Training progress deleted successfully" });
  } catch (error) {
    console.error("Error deleting training progress:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}; 