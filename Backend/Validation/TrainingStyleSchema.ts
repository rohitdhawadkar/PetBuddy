import { z } from "zod";

// Base training style schema
const trainingStyleBaseSchema = z.object({
  trainer_id: z.number(),
  primary_style: z.string(),
  secondary_style: z.string().optional(),
  methodology: z.string(),
  specializations: z.array(z.string()),
  certifications: z.array(z.string()),
});

// Create training style schema
export const createTrainingStyleSchema = trainingStyleBaseSchema;

// Update training style schema
export const updateTrainingStyleSchema = trainingStyleBaseSchema.partial();

// Style ID parameter schema
export const styleIdParamSchema = z.object({
  style_id: z.string().transform((val) => parseInt(val, 10)),
});

// Trainer ID parameter schema
export const trainerIdParamSchema = z.object({
  trainer_id: z.string().transform((val) => parseInt(val, 10)),
});

// Types
export type CreateTrainingStyleInput = z.infer<typeof createTrainingStyleSchema>;
export type UpdateTrainingStyleInput = z.infer<typeof updateTrainingStyleSchema>;
export type StyleIdParam = z.infer<typeof styleIdParamSchema>;
export type TrainerIdParam = z.infer<typeof trainerIdParamSchema>; 