import { Request, Response } from "express";
import { prisma } from "./prisma";
import { redis } from "./redis";

// Create Training Style
export const CreateTrainingStyle = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      trainer_id,
      primary_style,
      secondary_style,
      methodology,
      specializations,
      certifications,
    } = req.body;

    // Check if trainer exists
    const trainer = await prisma.trainer.findUnique({
      where: { trainer_id },
    });

    if (!trainer) {
      res.status(404).json({ message: "Trainer not found" });
      return;
    }

    // Check if style already exists for this trainer
    const existingStyle = await prisma.trainingStyle.findUnique({
      where: { trainer_id },
    });

    if (existingStyle) {
      res.status(400).json({ message: "Training style already exists for this trainer" });
      return;
    }

    // Create training style
    const trainingStyle = await prisma.trainingStyle.create({
      data: {
        trainer_id,
        primary_style,
        secondary_style,
        methodology,
        specializations,
        certifications,
      },
      include: {
        trainer: true,
      },
    });

    // Invalidate cache
    await redis.del(`trainer_style:${trainer_id}`);

    res.status(201).json({
      message: "Training style created successfully",
      data: trainingStyle,
    });
  } catch (error) {
    console.error("Error creating training style:", error);
    res.status(500).json({
      message: "Error creating training style",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get Training Style by ID
export const GetTrainingStyle = async (
  req: Request<{ style_id: string }>,
  res: Response
): Promise<void> => {
  try {
    const style_id = parseInt(req.params.style_id, 10);

    if (isNaN(style_id)) {
      res.status(400).json({ message: "Invalid style ID" });
      return;
    }

    // Try to get from cache first
    const cacheKey = `style:${style_id}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      res.status(200).json(JSON.parse(cachedData));
      return;
    }

    const trainingStyle = await prisma.trainingStyle.findUnique({
      where: { style_id },
      include: {
        trainer: true,
      },
    });

    if (!trainingStyle) {
      res.status(404).json({ message: "Training style not found" });
      return;
    }

    // Cache the response
    await redis.setEx(cacheKey, 3600, JSON.stringify(trainingStyle));

    res.status(200).json(trainingStyle);
  } catch (error) {
    console.error("Error retrieving training style:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get Training Style by Trainer ID
export const GetTrainerStyle = async (
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
    const cacheKey = `trainer_style:${trainer_id}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      res.status(200).json(JSON.parse(cachedData));
      return;
    }

    const trainingStyle = await prisma.trainingStyle.findUnique({
      where: { trainer_id },
      include: {
        trainer: true,
      },
    });

    if (!trainingStyle) {
      res.status(404).json({ message: "Training style not found for this trainer" });
      return;
    }

    // Cache the response
    await redis.setEx(cacheKey, 3600, JSON.stringify(trainingStyle));

    res.status(200).json(trainingStyle);
  } catch (error) {
    console.error("Error retrieving trainer style:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update Training Style
export const UpdateTrainingStyle = async (
  req: Request<{ style_id: string }>,
  res: Response
): Promise<void> => {
  try {
    const style_id = parseInt(req.params.style_id, 10);
    const {
      primary_style,
      secondary_style,
      methodology,
      specializations,
      certifications,
    } = req.body;

    if (isNaN(style_id)) {
      res.status(400).json({ message: "Invalid style ID" });
      return;
    }

    const existingStyle = await prisma.trainingStyle.findUnique({
      where: { style_id },
    });

    if (!existingStyle) {
      res.status(404).json({ message: "Training style not found" });
      return;
    }

    // Update training style
    const updatedStyle = await prisma.trainingStyle.update({
      where: { style_id },
      data: {
        primary_style,
        secondary_style,
        methodology,
        specializations,
        certifications,
      },
      include: {
        trainer: true,
      },
    });

    // Invalidate cache
    await redis.del(`style:${style_id}`);
    await redis.del(`trainer_style:${existingStyle.trainer_id}`);

    res.status(200).json({
      message: "Training style updated successfully",
      data: updatedStyle,
    });
  } catch (error) {
    console.error("Error updating training style:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete Training Style
export const DeleteTrainingStyle = async (
  req: Request<{ style_id: string }>,
  res: Response
): Promise<void> => {
  try {
    const style_id = parseInt(req.params.style_id, 10);

    if (isNaN(style_id)) {
      res.status(400).json({ message: "Invalid style ID" });
      return;
    }

    const existingStyle = await prisma.trainingStyle.findUnique({
      where: { style_id },
    });

    if (!existingStyle) {
      res.status(404).json({ message: "Training style not found" });
      return;
    }

    // Delete training style
    await prisma.trainingStyle.delete({
      where: { style_id },
    });

    // Invalidate cache
    await redis.del(`style:${style_id}`);
    await redis.del(`trainer_style:${existingStyle.trainer_id}`);

    res.status(200).json({ message: "Training style deleted successfully" });
  } catch (error) {
    console.error("Error deleting training style:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}; 