import { Request, Response } from "express";
import { prisma } from "./prisma";
import { redis } from "./redis";

// Create Diet Plan
export async function CreateDietPlan(
  req: Request<{}, {}, {
    health_tracker_id: number;
    plan_name: string;
    start_date: Date;
    status: 'Active' | 'Completed';
    notes: string;
  }>,
  res: Response
): Promise<void> {
  try {
    const { health_tracker_id, plan_name, start_date, status, notes } = req.body;

    console.log("CreateDietPlan received:", { 
      health_tracker_id, plan_name, start_date, status, notes 
    });

    // Check if health tracker exists
    const healthTracker = await prisma.healthTracker.findUnique({
      where: { HealthTrackr_id: health_tracker_id },
    });

    if (!healthTracker) {
      res.status(404).json({ message: "Health tracker not found" });
      return;
    }

    // Check if a diet plan already exists for this health tracker
    const existingPlan = await prisma.dietPlan.findUnique({
      where: { health_tracker_id },
    });

    let dietPlan;
    
    if (existingPlan) {
      // Update existing plan
      dietPlan = await prisma.dietPlan.update({
        where: { health_tracker_id },
        data: {
          plan_name,
          start_date,
          status,
          notes,
        },
        include: {
          HealthTracker: true,
        },
      });
    } else {
      // Create a new diet plan if none exists
      dietPlan = await prisma.dietPlan.create({
        data: {
          health_tracker_id,
          plan_name,
          start_date,
          status,
          notes,
        },
        include: {
          HealthTracker: true,
        },
      });
    }

    // Invalidate cache
    const cacheKey = `diet_plan:${health_tracker_id}`;
    await redis.del(cacheKey);

    res.status(201).json({
      message: existingPlan 
        ? "Diet plan updated successfully" 
        : "Diet plan created successfully",
      data: dietPlan,
    });
  } catch (error) {
    console.error("Error creating diet plan:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Diet Plan by Health Tracker ID
export async function GetDietPlan(
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
    const cacheKey = `diet_plan:${health_tracker_id}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      res.status(200).json(JSON.parse(cachedData));
      return;
    }

    const dietPlan = await prisma.dietPlan.findUnique({
      where: { health_tracker_id },
      include: {
        HealthTracker: true,
      },
    });

    if (!dietPlan) {
      res.status(404).json({ message: "Diet plan not found" });
      return;
    }

    // Cache the response
    await redis.setEx(cacheKey, 10, JSON.stringify(dietPlan));

    res.status(200).json(dietPlan);
  } catch (error) {
    console.error("Error retrieving diet plan:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Update Diet Plan
export async function UpdateDietPlan(
  req: Request<{ health_tracker_id: string }, {}, {
    plan_name: string;
    start_date: Date;
    status: 'Active' | 'Completed';
    notes: string;
  }>,
  res: Response
): Promise<void> {
  try {
    const health_tracker_id = parseInt(req.params.health_tracker_id, 10);
    const { plan_name, start_date, status, notes } = req.body;

    if (isNaN(health_tracker_id)) {
      res.status(400).json({ message: "Invalid health tracker ID" });
      return;
    }

    const existingPlan = await prisma.dietPlan.findUnique({
      where: { health_tracker_id },
    });

    if (!existingPlan) {
      res.status(404).json({ message: "Diet plan not found" });
      return;
    }

    const updatedPlan = await prisma.dietPlan.update({
      where: { health_tracker_id },
      data: {
        plan_name,
        start_date,
        status,
        notes,
      },
      include: {
        HealthTracker: true,
      },
    });

    // Invalidate cache
    const cacheKey = `diet_plan:${health_tracker_id}`;
    await redis.del(cacheKey);

    res.status(200).json({
      message: "Diet plan updated successfully",
      data: updatedPlan,
    });
  } catch (error) {
    console.error("Error updating diet plan:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Diet Plan
export async function DeleteDietPlan(
  req: Request<{ health_tracker_id: string }>,
  res: Response
): Promise<void> {
  try {
    const health_tracker_id = parseInt(req.params.health_tracker_id, 10);

    if (isNaN(health_tracker_id)) {
      res.status(400).json({ message: "Invalid health tracker ID" });
      return;
    }

    const existingPlan = await prisma.dietPlan.findUnique({
      where: { health_tracker_id },
    });

    if (!existingPlan) {
      res.status(404).json({ message: "Diet plan not found" });
      return;
    }

    await prisma.dietPlan.delete({
      where: { health_tracker_id },
    });

    // Invalidate cache
    const cacheKey = `diet_plan:${health_tracker_id}`;
    await redis.del(cacheKey);

    res.status(200).json({ message: "Diet plan deleted successfully" });
  } catch (error) {
    console.error("Error deleting diet plan:", error);
    res.status(500).json({ message: "Internal server error" });
  }
} 