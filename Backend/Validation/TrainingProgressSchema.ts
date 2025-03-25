import { z } from "zod";

// Base training progress schema
const trainingProgressBaseSchema = z.object({
  trainer_id: z.number(),
  pet_id: z.number(),
  skill_name: z.string(),
  current_level: z.number().min(1).max(5),
  target_level: z.number().min(1).max(5),
  last_assessed: z.string().datetime(),
  assessment_notes: z.string().optional(),
  next_steps: z.string().optional(),
});

// Create training progress schema
export const createTrainingProgressSchema = trainingProgressBaseSchema;

// Update training progress schema
export const updateTrainingProgressSchema = trainingProgressBaseSchema.partial();

// Progress ID parameter schema
export const progressIdParamSchema = z.object({
  progress_id: z.string().transform((val) => parseInt(val, 10)),
});

// Trainer ID parameter schema
export const trainerIdParamSchema = z.object({
  trainer_id: z.string().transform((val) => parseInt(val, 10)),
});

// Pet ID parameter schema
export const petIdParamSchema = z.object({
  pet_id: z.string().transform((val) => parseInt(val, 10)),
});

// Types
export type CreateTrainingProgressInput = z.infer<typeof createTrainingProgressSchema>;
export type UpdateTrainingProgressInput = z.infer<typeof updateTrainingProgressSchema>;
export type ProgressIdParam = z.infer<typeof progressIdParamSchema>;
export type TrainerIdParam = z.infer<typeof trainerIdParamSchema>;
export type PetIdParam = z.infer<typeof petIdParamSchema>; 