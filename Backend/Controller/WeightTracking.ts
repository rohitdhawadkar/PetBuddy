import { Request, Response } from "express";
import { prisma } from "./prisma";
import { redis } from "./redis";

// Create Weight Tracking Entry
// In Backend/Controller/WeightTracking.ts
export async function CreateWeightTracking(
  req: Request<{}, {}, { health_tracker_id: number; Weight: number; date: Date }>,
  res: Response
): Promise<void> {
  try {
    const { health_tracker_id, Weight, date } = req.body;

    // Check if health tracker exists
    const healthTracker = await prisma.healthTracker.findUnique({
      where: { HealthTrackr_id: health_tracker_id },
    });

    if (!healthTracker) {
      res.status(404).json({ message: "Health tracker not found" });
      return;
    }

    // Check if weight tracking already exists
    const existingWeightTracking = await prisma.weightTracking.findUnique({
      where: { health_tracker_id },
    });

    let weightTracking;
    if (existingWeightTracking) {
      // Update existing weight tracking
      weightTracking = await prisma.weightTracking.update({
        where: { health_tracker_id },
        data: {
          Weight,
          date,
        },
        include: {
          HealthTracker: true,
        },
      });
    } else {
      // Create new weight tracking
      weightTracking = await prisma.weightTracking.create({
        data: {
          health_tracker_id,
          Weight,
          date,
        },
        include: {
          HealthTracker: true,
        },
      });
    }

    // Invalidate cache
    const cacheKey = `weight_tracking:${health_tracker_id}`;
    await redis.del(cacheKey);

    res.status(201).json({
      message: "Weight tracking entry created/updated successfully",
      data: weightTracking,
    });
  } catch (error) {
    console.error("Error creating weight tracking entry:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Weight Tracking by Health Tracker ID
export async function GetWeightTracking(
  req: Request<{ health_tracker_id: string }>,
  res: Response
): Promise<void> {
  try {
    const health_tracker_id = parseInt(req.params.health_tracker_id, 10);

    if (isNaN(health_tracker_id)) {
      res.status(400).json({ message: "Invalid health tracker ID" });
      return;
    }

    // Try to get from cache first
    const cacheKey = `weight_tracking:${health_tracker_id}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      res.status(200).json(JSON.parse(cachedData));
      return;
    }

    const weightTracking = await prisma.weightTracking.findUnique({
      where: { health_tracker_id },
      include: {
        HealthTracker: true,
      },
    });

    if (!weightTracking) {
      res.status(404).json({ message: "Weight tracking not found" });
      return;
    }

    // Cache the response
    await redis.setEx(cacheKey, 10, JSON.stringify(weightTracking));

    res.status(200).json(weightTracking);
  } catch (error) {
    console.error("Error retrieving weight tracking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Update Weight Tracking
export async function UpdateWeightTracking(
  req: Request<{ health_tracker_id: string }, {}, { Weight: number; date: Date }>,
  res: Response
): Promise<void> {
  try {
    const health_tracker_id = parseInt(req.params.health_tracker_id, 10);
    const { Weight, date } = req.body;

    if (isNaN(health_tracker_id)) {
      res.status(400).json({ message: "Invalid health tracker ID" });
      return;
    }

    const existingEntry = await prisma.weightTracking.findUnique({
      where: { health_tracker_id },
    });

    if (!existingEntry) {
      res.status(404).json({ message: "Weight tracking not found" });
      return;
    }

    const updatedEntry = await prisma.weightTracking.update({
      where: { health_tracker_id },
      data: {
        Weight,
        date,
      },
      include: {
        HealthTracker: true,
      },
    });

    // Invalidate cache
    const cacheKey = `weight_tracking:${health_tracker_id}`;
    await redis.del(cacheKey);

    res.status(200).json({
      message: "Weight tracking updated successfully",
      data: updatedEntry,
    });
  } catch (error) {
    console.error("Error updating weight tracking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Weight Tracking
export async function DeleteWeightTracking(
  req: Request<{ health_tracker_id: string }>,
  res: Response
): Promise<void> {
  try {
    const health_tracker_id = parseInt(req.params.health_tracker_id, 10);

    if (isNaN(health_tracker_id)) {
      res.status(400).json({ message: "Invalid health tracker ID" });
      return;
    }

    const existingEntry = await prisma.weightTracking.findUnique({
      where: { health_tracker_id },
    });

    if (!existingEntry) {
      res.status(404).json({ message: "Weight tracking not found" });
      return;
    }

    await prisma.weightTracking.delete({
      where: { health_tracker_id },
    });

    // Invalidate cache
    const cacheKey = `weight_tracking:${health_tracker_id}`;
    await redis.del(cacheKey);

    res.status(200).json({ message: "Weight tracking deleted successfully" });
  } catch (error) {
    console.error("Error deleting weight tracking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
} 