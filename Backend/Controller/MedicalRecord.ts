import { Request, Response } from "express";
import { prisma } from "./prisma";
import { redis } from "./redis";

// Create Medical Record
export async function CreateMedicalRecord(
  req: Request<{}, {}, {
    health_tracker_id: number;
    record_type: string;
    description: string;
    date: Date;
    vet_id: number;
  }>,
  res: Response
): Promise<void> {
  try {
    const { health_tracker_id, record_type, description, date, vet_id } = req.body;

    // Check if health tracker exists
    const healthTracker = await prisma.healthTracker.findUnique({
      where: { HealthTrackr_id: health_tracker_id },
    });

    if (!healthTracker) {
      res.status(404).json({ message: "Health tracker not found" });
      return;
    }

    // Check if vet exists
    const vet = await prisma.vet.findUnique({
      where: { vet_id },
    });

    if (!vet) {
      res.status(404).json({ message: "Vet not found" });
      return;
    }

    const medicalRecord = await prisma.medicalRecord.create({
      data: {
        health_tracker_id,
        record_type,
        description,
        date,
        vet_id,
      },
      include: {
        HealthTracker: true,
        Vet: true,
      },
    });

    // Invalidate cache
    const cacheKey = `medical_record:${health_tracker_id}`;
    await redis.del(cacheKey);

    res.status(201).json({
      message: "Medical record created successfully",
      data: medicalRecord,
    });
  } catch (error) {
    console.error("Error creating medical record:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Medical Record by Health Tracker ID
export async function GetMedicalRecord(
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
    const cacheKey = `medical_record:${health_tracker_id}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      res.status(200).json(JSON.parse(cachedData));
      return;
    }

    const medicalRecord = await prisma.medicalRecord.findUnique({
      where: { health_tracker_id },
      include: {
        HealthTracker: true,
        Vet: true,
      },
    });

    if (!medicalRecord) {
      res.status(404).json({ message: "Medical record not found" });
      return;
    }

    // Cache the response
    await redis.setEx(cacheKey, 10, JSON.stringify(medicalRecord));

    res.status(200).json(medicalRecord);
  } catch (error) {
    console.error("Error retrieving medical record:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Update Medical Record
export async function UpdateMedicalRecord(
  req: Request<{ health_tracker_id: string }, {}, {
    record_type: string;
    description: string;
    date: Date;
    vet_id: number;
  }>,
  res: Response
): Promise<void> {
  try {
    const health_tracker_id = parseInt(req.params.health_tracker_id, 10);
    const { record_type, description, date, vet_id } = req.body;

    if (isNaN(health_tracker_id)) {
      res.status(400).json({ message: "Invalid health tracker ID" });
      return;
    }

    const existingRecord = await prisma.medicalRecord.findUnique({
      where: { health_tracker_id },
    });

    if (!existingRecord) {
      res.status(404).json({ message: "Medical record not found" });
      return;
    }

    // Check if vet exists
    const vet = await prisma.vet.findUnique({
      where: { vet_id },
    });

    if (!vet) {
      res.status(404).json({ message: "Vet not found" });
      return;
    }

    const updatedRecord = await prisma.medicalRecord.update({
      where: { health_tracker_id },
      data: {
        record_type,
        description,
        date,
        vet_id,
      },
      include: {
        HealthTracker: true,
        Vet: true,
      },
    });

    // Invalidate cache
    const cacheKey = `medical_record:${health_tracker_id}`;
    await redis.del(cacheKey);

    res.status(200).json({
      message: "Medical record updated successfully",
      data: updatedRecord,
    });
  } catch (error) {
    console.error("Error updating medical record:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Medical Record
export async function DeleteMedicalRecord(
  req: Request<{ health_tracker_id: string }>,
  res: Response
): Promise<void> {
  try {
    const health_tracker_id = parseInt(req.params.health_tracker_id, 10);

    if (isNaN(health_tracker_id)) {
      res.status(400).json({ message: "Invalid health tracker ID" });
      return;
    }

    const existingRecord = await prisma.medicalRecord.findUnique({
      where: { health_tracker_id },
    });

    if (!existingRecord) {
      res.status(404).json({ message: "Medical record not found" });
      return;
    }

    await prisma.medicalRecord.delete({
      where: { health_tracker_id },
    });

    // Invalidate cache
    const cacheKey = `medical_record:${health_tracker_id}`;
    await redis.del(cacheKey);

    res.status(200).json({ message: "Medical record deleted successfully" });
  } catch (error) {
    console.error("Error deleting medical record:", error);
    res.status(500).json({ message: "Internal server error" });
  }
} 