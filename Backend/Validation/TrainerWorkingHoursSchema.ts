import { z } from "zod";

// Base working hours schema
const workingHoursBaseSchema = z.object({
  trainer_id: z.number(),
  day_of_week: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  is_available: z.boolean(),
});

// Create working hours schema
export const createWorkingHoursSchema = workingHoursBaseSchema;

// Update working hours schema
export const updateWorkingHoursSchema = workingHoursBaseSchema.partial();

// Working hours ID parameter schema
export const workingHoursIdParamSchema = z.object({
  working_hours_id: z.string().transform((val) => parseInt(val, 10)),
});

// Trainer ID parameter schema
export const trainerIdParamSchema = z.object({
  trainer_id: z.string().transform((val) => parseInt(val, 10)),
});

// Types
export type CreateWorkingHoursInput = z.infer<typeof createWorkingHoursSchema>;
export type UpdateWorkingHoursInput = z.infer<typeof updateWorkingHoursSchema>;
export type WorkingHoursIdParam = z.infer<typeof workingHoursIdParamSchema>;
export type TrainerIdParam = z.infer<typeof trainerIdParamSchema>; 