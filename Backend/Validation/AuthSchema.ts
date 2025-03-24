import { z } from "zod";

const petDetailsSchema = z.object({
  pet_name: z.string().min(1, "Pet name is required"),
  breed: z.string().min(1, "Breed is required"),
  age: z.number().int().nonnegative("Age must be a non-negative integer"),
  weight: z.number().nonnegative("Weight must be a non-negative number"),
  pet_photo: z.instanceof(Buffer).or(z.instanceof(Uint8Array)).or(z.null()),
  medical_condition: z.string().nullable(),
});

export const userRegisterSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  email: z.string().email("Invalid email address"),
  pets: z.array(petDetailsSchema).optional(),
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required").nullable(),
  email: z.string().email("Invalid email").nullable(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// TrainerRegisterRequest schema
export const trainerRegisterSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  email: z.string().email("Invalid email address"),
  certification_id: z.string().min(1, "Certification ID is required"),
  experience_years: z
    .number()
    .int()
    .nonnegative("Experience must be a non-negative integer"),
});

// VetRegisterRequest schema
export const vetRegisterSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  email: z.string().email("Invalid email address"),
  license_id: z.string().min(1, "License ID is required"),
  specialty: z.string().min(1, "Specialty is required"),
});

// Infer types from schemas
export type LoginRequest = z.infer<typeof loginSchema>;
export type TrainerRegisterRequest = z.infer<typeof trainerRegisterSchema>;
export type VetRegisterRequest = z.infer<typeof vetRegisterSchema>;
export type UserRegisterRequest = z.infer<typeof userRegisterSchema>;
