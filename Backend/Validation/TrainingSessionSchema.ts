import { z } from "zod";

// Base training session schema
const trainingSessionBaseSchema = z.object({
  trainer_id: z.number(),
  pet_id: z.number(),
  session_date: z.string().datetime(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  session_type: z.enum(["BASIC", "ADVANCED", "BEHAVIORAL", "SPECIALIZED"]),
  focus_areas: z.array(z.string()),
  notes: z.string().optional(),
});

// Create training session schema
export const createTrainingSessionSchema = trainingSessionBaseSchema;

// Update training session schema
export const updateTrainingSessionSchema = trainingSessionBaseSchema.partial().extend({
  status: z.enum(["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
  progress_notes: z.string().optional(),
});

// Session ID parameter schema
export const sessionIdParamSchema = z.object({
  session_id: z.string().transform((val) => parseInt(val, 10)),
});

// Trainer ID parameter schema
export const trainerIdParamSchema = z.object({
  trainer_id: z.string().transform((val) => parseInt(val, 10)),
});

// Types
export type CreateTrainingSessionInput = z.infer<typeof createTrainingSessionSchema>;
export type UpdateTrainingSessionInput = z.infer<typeof updateTrainingSessionSchema>;
export type SessionIdParam = z.infer<typeof sessionIdParamSchema>;
export type TrainerIdParam = z.infer<typeof trainerIdParamSchema>; 