import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { redis } from "./redis";
import axios from "axios";

// Create Health Tracker with all components
export const CreateHealthTracker = async (req: Request, res: Response): Promise<void> => {
  try {
    const { h_petProfile_id, weight, medicalRecord, dietPlan } = req.body;

    // Check if health tracker already exists
    const existingTracker = await prisma.healthTracker.findUnique({
      where: { h_petProfile_id },
    });

    if (existingTracker) {
      res.status(400).json({
        message: "Health tracker already exists for this pet profile",
      });
      return;
    }

    // If medical record is provided, validate vet existence
    if (medicalRecord) {
      const vet = await prisma.vet.findUnique({
        where: { vet_id: medicalRecord.vet_id },
      });

      if (!vet) {
        res.status(404).json({
          message: "Vet not found. Cannot create medical record with non-existent vet.",
        });
        return;
      }
    }

    // Use a transaction to create all components together
    const result = await prisma.$transaction(async (tx) => {
      // Create health tracker
      const healthTracker = await tx.healthTracker.create({
        data: {
          h_petProfile_id,
        },
        include: {
          PetProfile: true,
        },
      });

      // Create weight tracking if provided
      if (weight) {
        await tx.weightTracking.create({
          data: {
            health_tracker_id: healthTracker.HealthTrackr_id,
            Weight: weight.Weight,
            date: weight.date,
          },
        });
      }

      // Create medical record if provided
      if (medicalRecord) {
        await tx.medicalRecord.create({
          data: {
            health_tracker_id: healthTracker.HealthTrackr_id,
            record_type: medicalRecord.record_type,
            description: medicalRecord.description,
            date: medicalRecord.date,
            vet_id: medicalRecord.vet_id,
          },
        });
      }

      // Create diet plan if provided
      if (dietPlan) {
        await tx.dietPlan.create({
          data: {
            health_tracker_id: healthTracker.HealthTrackr_id,
            plan_name: dietPlan.plan_name,
            start_date: dietPlan.start_date,
            status: dietPlan.status,
            notes: dietPlan.notes,
          },
        });
      }

      // Fetch the complete health tracker with all components
      return await tx.healthTracker.findUnique({
        where: { HealthTrackr_id: healthTracker.HealthTrackr_id },
        include: {
          PetProfile: true,
          WeightTracking: true,
          MedicalRecord: true,
          DietPlan: true,
        },
      });
    });

    // Invalidate cache
    await redis.del(`health_tracker:${h_petProfile_id}`);

    res.status(201).json({
      message: "Health tracker and related components created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error creating health tracker:", error);
    res.status(500).json({
      message: "Error creating health tracker",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get Health Tracker with all components
export async function GetHealthTracker(
  req: Request<{ h_petProfile_id: string }>,
  res: Response
): Promise<void> {
  try {
    const h_petProfile_id = parseInt(req.params.h_petProfile_id, 10);

    if (isNaN(h_petProfile_id)) {
      res.status(400).json({ message: "Invalid pet profile ID" });
      return;
    }

    // Try to get from cache first
    const cacheKey = `health_tracker:${h_petProfile_id}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      res.status(200).json(JSON.parse(cachedData));
      return;
    }

    const healthTracker = await prisma.healthTracker.findUnique({
      where: { h_petProfile_id },
      include: {
        PetProfile: true,
        WeightTracking: true,
        MedicalRecord: true,
        DietPlan: true,
      },
    });

    if (!healthTracker) {
      res.status(404).json({ message: "Health tracker not found" });
      return;
    }

    // Cache the response
    await redis.setEx(cacheKey, 10, JSON.stringify(healthTracker));

    res.status(200).json(healthTracker);
  } catch (error) {
    console.error("Error retrieving health tracker:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Update Health Tracker and its components
export async function UpdateHealthTracker(
  req: Request<{ h_petProfile_id: string }, {}, {
    h_petProfile_id: number;
    weight?: { Weight: number; date: Date };
    medicalRecord?: { record_type: string; description: string; date: Date; vet_id: number };
    dietPlan?: { plan_name: string; start_date: Date; status: 'Active' | 'Completed'; notes: string };
  }>,
  res: Response
): Promise<void> {
  try {
    const h_petProfile_id = parseInt(req.params.h_petProfile_id, 10);
    const { weight, medicalRecord, dietPlan } = req.body;

    if (isNaN(h_petProfile_id)) {
      res.status(400).json({ message: "Invalid pet profile ID" });
      return;
    }

    const existingTracker = await prisma.healthTracker.findUnique({
      where: { h_petProfile_id },
    });

    if (!existingTracker) {
      res.status(404).json({ message: "Health tracker not found" });
      return;
    }

    // Update related components if provided
    if (weight) {
      await axios.put(`http://localhost:3000/weight-tracking/${h_petProfile_id}`, weight);
    }

    if (medicalRecord) {
      await axios.put(`http://localhost:3000/medical-record/${h_petProfile_id}`, medicalRecord);
    }

    if (dietPlan) {
      await axios.put(`http://localhost:3000/diet-plan/${h_petProfile_id}`, dietPlan);
    }

    const updatedTracker = await prisma.healthTracker.update({
      where: { h_petProfile_id },
      data: {}, // Empty object since we're not updating the health tracker itself
      include: {
        PetProfile: true,
        WeightTracking: true,
        MedicalRecord: true,
        DietPlan: true,
      },
    });

    // Invalidate cache
    const cacheKey = `health_tracker:${h_petProfile_id}`;
    await redis.del(cacheKey);

    res.status(200).json({
      message: "Health tracker and components updated successfully",
      data: updatedTracker,
    });
  } catch (error) {
    console.error("Error updating health tracker:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Health Tracker and all its components
export async function DeleteHealthTracker(
  req: Request<{ h_petProfile_id: string }>,
  res: Response
): Promise<void> {
  try {
    const h_petProfile_id = parseInt(req.params.h_petProfile_id, 10);

    if (isNaN(h_petProfile_id)) {
      res.status(400).json({ message: "Invalid pet profile ID" });
      return;
    }

    const existingTracker = await prisma.healthTracker.findUnique({
      where: { h_petProfile_id },
    });

    if (!existingTracker) {
      res.status(404).json({ message: "Health tracker not found" });
      return;
    }

    // Delete related components
    await axios.delete(`http://localhost:3000/weight-tracking/${h_petProfile_id}`);
    await axios.delete(`http://localhost:3000/medical-record/${h_petProfile_id}`);
    await axios.delete(`http://localhost:3000/diet-plan/${h_petProfile_id}`);

    // Delete health tracker
    await prisma.healthTracker.delete({
      where: { h_petProfile_id },
    });

    // Invalidate cache
    const cacheKey = `health_tracker:${h_petProfile_id}`;
    await redis.del(cacheKey);

    res.status(200).json({ message: "Health tracker and all components deleted successfully" });
  } catch (error) {
    console.error("Error deleting health tracker:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
