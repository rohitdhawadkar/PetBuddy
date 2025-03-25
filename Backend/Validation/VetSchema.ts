import { z } from "zod";

// Create Vet Schema
export const createVetSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  license_id: z.string(),
  specialty: z.string(),
  clinic_id: z.number().optional(),
  workingHours: z.array(z.object({
    day_of_week: z.number().min(0).max(6),
    start_time: z.coerce.date(),
    end_time: z.coerce.date(),
    is_available: z.boolean().optional(),
  })).optional(),
});

// Update Vet Schema
export const updateVetSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  license_id: z.string().optional(),
  specialty: z.string().optional(),
  clinic_id: z.number().optional(),
  workingHours: z.array(z.object({
    day_of_week: z.number().min(0).max(6),
    start_time: z.coerce.date(),
    end_time: z.coerce.date(),
    is_available: z.boolean().optional(),
  })).optional(),
});

// Vet ID Parameter Schema
export const vetIdParamSchema = z.object({
  vet_id: z.string().transform((val) => parseInt(val, 10)),
});

// Types
export type CreateVetInput = z.infer<typeof createVetSchema>;
export type UpdateVetInput = z.infer<typeof updateVetSchema>;
export type VetIdParam = z.infer<typeof vetIdParamSchema>; 