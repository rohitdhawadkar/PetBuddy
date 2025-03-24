import { z } from "zod";

// Base schema for common pet fields
const petBaseSchema = z.object({
  pet_name: z.string().min(1, "Pet name is required").max(50, "Pet name is too long"),
  breed: z.string().min(1, "Breed is required").max(100, "Breed name is too long"),
  age: z.number().int().positive("Age must be a positive number").max(30, "Age seems too high"),
  weight: z.number().positive("Weight must be a positive number").max(200, "Weight seems too high"),
  pet_photo: z.union([
    z.instanceof(Buffer),
    z.instanceof(Uint8Array),
    z.null()
  ]).optional(),
  medical_condition: z.string().nullable().optional(),
  user_id: z.number().int().positive("User ID must be a positive number")
});

// Schema for creating a new pet
export const createPetSchema = petBaseSchema;

// Schema for updating a pet
export const updatePetSchema = petBaseSchema.partial();

// Schema for validating pet_id in URL parameters
export const petIdParamSchema = z.object({
  pet_id: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    "Invalid pet ID"
  )
});

// Schema for validating user_id in URL parameters
export const userIdParamSchema = z.object({
  user_id: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    "Invalid user ID"
  )
});

// Schema for validating both pet_id and user_id in URL parameters
export const petAndUserIdParamsSchema = z.object({
  pet_id: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    "Invalid pet ID"
  ),
  user_id: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    "Invalid user ID"
  )
});

// Schema for validating request body in getPetForUserById
export const getPetByIdSchema = z.object({
  user_id: z.number().int().positive("User ID must be a positive number")
});

// Type inference
export type CreatePetInput = z.infer<typeof createPetSchema>;
export type UpdatePetInput = z.infer<typeof updatePetSchema>;
export type PetIdParam = z.infer<typeof petIdParamSchema>;
export type UserIdParam = z.infer<typeof userIdParamSchema>;
export type PetAndUserIdParams = z.infer<typeof petAndUserIdParamsSchema>;
export type GetPetByIdInput = z.infer<typeof getPetByIdSchema>;
