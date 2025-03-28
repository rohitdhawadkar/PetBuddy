import { Request, Response } from "express";
import { prisma } from "./prisma";
import { redis } from "./redis";
import { AppointmentStatus } from "@prisma/client";

// Create new appointment
export const CreateAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      vet_id,
      pet_id,
      appointment_date,
      start_time,
      end_time,
      status = "SCHEDULED",
      notes
    } = req.body.body;

    // Check if vet exists
    const vet = await prisma.vet.findUnique({
      where: { vet_id }
    });

    if (!vet) {
      res.status(404).json({ message: "Vet not found" });
      return;
    }

    // Check if pet exists
    const pet = await prisma.pet.findUnique({
      where: { pet_id }
    });

    if (!pet) {
      res.status(404).json({ message: "Pet not found" });
      return;
    }

    // Check for scheduling conflicts
    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        vet_id,
        appointment_date,
        OR: [
          {
            AND: [
              { start_time: { lte: new Date(start_time) } },
              { end_time: { gt: new Date(start_time) } }
            ]
          },
          {
            AND: [
              { start_time: { lt: new Date(end_time) } },
              { end_time: { gte: new Date(end_time) } }
            ]
          }
        ]
      }
    });

    if (conflictingAppointment) {
      res.status(400).json({ message: "This time slot is already booked" });
      return;
    }

    const appointment = await prisma.appointment.create({
      data: {
        vet_id,
        pet_id,
        appointment_date: new Date(appointment_date),
        start_time: new Date(start_time),
        end_time: new Date(end_time),
        status: status as AppointmentStatus,
        notes
      },
      include: {
        vet: true,
        pet: true
      }
    });

    // Cache the new appointment
    await redis.setEx(`appointment:${appointment.appointment_id}`, 3600, JSON.stringify(appointment));

    res.status(201).json({
      message: "Appointment created successfully",
      data: appointment
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({
      message: "Error creating appointment",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

// Get appointment by ID
export const GetAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const appointment_id = parseInt(req.params.appointment_id, 10);

    if (isNaN(appointment_id)) {
      res.status(400).json({ message: "Invalid appointment ID" });
      return;
    }

    // Try to get from cache first
    const cacheKey = `appointment:${appointment_id}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      res.status(200).json(JSON.parse(cachedData));
      return;
    }

    const appointment = await prisma.appointment.findUnique({
      where: { appointment_id },
      include: {
        vet: true,
        pet: true
      }
    });

    if (!appointment) {
      res.status(404).json({ message: "Appointment not found" });
      return;
    }

    // Cache the response
    await redis.setEx(cacheKey, 3600, JSON.stringify(appointment));

    res.status(200).json(appointment);
  } catch (error) {
    console.error("Error retrieving appointment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update appointment
export const UpdateAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const appointment_id = parseInt(req.params.appointment_id, 10);
    const {
      appointment_date,
      start_time,
      end_time,
      status,
      notes
    } = req.body;

    if (isNaN(appointment_id)) {
      res.status(400).json({ message: "Invalid appointment ID" });
      return;
    }

    const existingAppointment = await prisma.appointment.findUnique({
      where: { appointment_id }
    });

    if (!existingAppointment) {
      res.status(404).json({ message: "Appointment not found" });
      return;
    }

    // Check for scheduling conflicts if time is being updated
    if (start_time && end_time) {
      const conflictingAppointment = await prisma.appointment.findFirst({
        where: {
          vet_id: existingAppointment.vet_id,
          appointment_date: appointment_date || existingAppointment.appointment_date,
          appointment_id: { not: appointment_id },
          OR: [
            {
              AND: [
                { start_time: { lte: new Date(start_time) } },
                { end_time: { gt: new Date(start_time) } }
              ]
            },
            {
              AND: [
                { start_time: { lt: new Date(end_time) } },
                { end_time: { gte: new Date(end_time) } }
              ]
            }
          ]
        }
      });

      if (conflictingAppointment) {
        res.status(400).json({ message: "This time slot is already booked" });
        return;
      }
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { appointment_id },
      data: {
        appointment_date: appointment_date ? new Date(appointment_date) : undefined,
        start_time: start_time ? new Date(start_time) : undefined,
        end_time: end_time ? new Date(end_time) : undefined,
        status: status as AppointmentStatus | undefined,
        notes
      },
      include: {
        vet: true,
        pet: true
      }
    });

    // Invalidate cache
    await redis.del(`appointment:${appointment_id}`);

    res.status(200).json({
      message: "Appointment updated successfully",
      data: updatedAppointment
    });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({
      message: "Error updating appointment",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

// Delete appointment
export const DeleteAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const appointment_id = parseInt(req.params.appointment_id, 10);

    if (isNaN(appointment_id)) {
      res.status(400).json({ message: "Invalid appointment ID" });
      return;
    }

    const existingAppointment = await prisma.appointment.findUnique({
      where: { appointment_id }
    });

    if (!existingAppointment) {
      res.status(404).json({ message: "Appointment not found" });
      return;
    }

    await prisma.appointment.delete({
      where: { appointment_id }
    });

    // Invalidate cache
    await redis.del(`appointment:${appointment_id}`);

    res.status(200).json({
      message: "Appointment deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({
      message: "Error deleting appointment",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

// Get appointments for a user (all pets)
export const GetUserAppointments = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.userId, 10);

    if (isNaN(userId)) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    // Get all appointments for the user's pets in a single query
    const appointments = await prisma.appointment.findMany({
      where: {
        pet: {
          user_id: userId
        }
      },
      include: {
        pet: {
          select: {
            pet_name: true,
            breed: true
          }
        },
        vet: {
          select: {
            username: true,
            specialty: true
          }
        }
      },
      orderBy: {
        appointment_date: 'asc'
      }
    });

    // Cache the appointments
    const cacheKey = `user_appointments:${userId}`;
    await redis.setEx(cacheKey, 3600, JSON.stringify(appointments));

    res.status(200).json({
      message: "Appointments fetched successfully",
      data: appointments
    });
  } catch (error) {
    console.error("Error fetching user appointments:", error);
    res.status(500).json({
      message: "Error fetching appointments",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}; 