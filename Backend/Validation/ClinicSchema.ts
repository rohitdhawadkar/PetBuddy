import { z } from "zod";

// Clinic Schemas
export const createClinicSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zip_code: z.string().min(1, "Zip code is required"),
    phone: z.string().min(1, "Phone is required"),
    email: z.string().email().optional(),
    website: z.string().url().optional(),
  }),
});

export const updateClinicSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").optional(),
    address: z.string().min(1, "Address is required").optional(),
    city: z.string().min(1, "City is required").optional(),
    state: z.string().min(1, "State is required").optional(),
    zip_code: z.string().min(1, "Zip code is required").optional(),
    phone: z.string().min(1, "Phone is required").optional(),
    email: z.string().email().optional(),
    website: z.string().url().optional(),
  }),
});

export const clinicIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Clinic ID is required"),
  }),
});

// Working Hours Schemas
export const createWorkingHoursSchema = z.object({
  body: z.object({
    vet_id: z.number().int().positive(),
    day_of_week: z.number().int().min(0).max(6),
    start_time: z.string().datetime(),
    end_time: z.string().datetime(),
    is_available: z.boolean().default(true),
  }),
});

export const updateWorkingHoursSchema = z.object({
  body: z.object({
    day_of_week: z.number().int().min(0).max(6).optional(),
    start_time: z.string().datetime().optional(),
    end_time: z.string().datetime().optional(),
    is_available: z.boolean().optional(),
  }),
});

export const workingHoursIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Working Hours ID is required"),
  }),
});

export const vetIdParamSchema = z.object({
  params: z.object({
    vetId: z.string().min(1, "Vet ID is required"),
  }),
});

// Appointment Schemas
export const createAppointmentSchema = z.object({
  body: z.object({
    vet_id: z.number().int().positive(),
    pet_id: z.number().int().positive(),
    appointment_date: z.string().datetime(),
    start_time: z.string().datetime(),
    end_time: z.string().datetime(),
    status: z.enum(["SCHEDULED", "COMPLETED", "CANCELLED"]).default("SCHEDULED"),
    notes: z.string().optional(),
  }),
});

export const updateAppointmentSchema = z.object({
  body: z.object({
    appointment_date: z.string().datetime().optional(),
    start_time: z.string().datetime().optional(),
    end_time: z.string().datetime().optional(),
    status: z.enum(["SCHEDULED", "COMPLETED", "CANCELLED"]).optional(),
    notes: z.string().optional(),
  }),
});

export const appointmentIdParamSchema = z.object({
  params: z.object({
    appointment_id: z.string().min(1, "Appointment ID is required"),
  }),
});

export const userIdParamSchema = z.object({
  params: z.object({
    userId: z.string().refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "Invalid user ID"
    ),
  }),
});

// Types
export type CreateClinicInput = z.infer<typeof createClinicSchema>["body"];
export type UpdateClinicInput = z.infer<typeof updateClinicSchema>["body"];
export type ClinicIdParam = z.infer<typeof clinicIdParamSchema>["params"];
export type CreateWorkingHoursInput = z.infer<typeof createWorkingHoursSchema>["body"];
export type UpdateWorkingHoursInput = z.infer<typeof updateWorkingHoursSchema>["body"];
export type WorkingHoursIdParam = z.infer<typeof workingHoursIdParamSchema>["params"];
export type VetIdParam = z.infer<typeof vetIdParamSchema>["params"];
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>["body"];
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>["body"];
export type AppointmentIdParam = z.infer<typeof appointmentIdParamSchema>["params"];
export type UserIdParam = z.infer<typeof userIdParamSchema>["params"]; 