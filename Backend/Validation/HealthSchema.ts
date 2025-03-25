import { z } from "zod";

// Health Tracker Schema
export const healthTrackerSchema = z.object({
  h_petProfile_id: z.number(),
  weight: z.object({
    Weight: z.number(),
    date: z.string().transform((str) => new Date(str))
  }).optional(),
  medicalRecord: z.object({
    record_type: z.string(),
    description: z.string(),
    date: z.string().transform((str) => new Date(str)),
    vet_id: z.number()
  }).optional(),
  dietPlan: z.object({
    plan_name: z.string(),
    start_date: z.string().transform((str) => new Date(str)),
    status: z.enum(['Active', 'Completed']),
    notes: z.string()
  }).optional()
});

// Weight Tracking Schema
export const weightTrackingSchema = z.object({
  Weight: z.number(),
  date: z.string().transform((str) => new Date(str))
});

// Medical Record Schema
export const medicalRecordSchema = z.object({
  record_type: z.string(),
  description: z.string(),
  date: z.string().transform((str) => new Date(str)),
  vet_id: z.number()
});

// Diet Plan Schema
export const dietPlanSchema = z.object({
  plan_name: z.string(),
  start_date: z.string().transform((str) => new Date(str)),
  status: z.enum(['Active', 'Completed']),
  notes: z.string()
}); 