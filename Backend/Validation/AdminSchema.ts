import { z } from "zod";

// Schema for creating a new admin
export const createAdminSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8),
  first_name: z.string().min(2).max(50),
  last_name: z.string().min(2).max(50),
  phone: z.string().optional(),
});

// Schema for updating an admin
export const updateAdminSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  first_name: z.string().min(2).max(50).optional(),
  last_name: z.string().min(2).max(50).optional(),
  phone: z.string().optional(),
  is_active: z.boolean().optional(),
});

// Schema for admin ID parameter
export const adminIdParamSchema = z.object({
  admin_id: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Admin ID must be a valid number",
  }),
});

// Type definitions
export type CreateAdminInput = z.infer<typeof createAdminSchema>;
export type UpdateAdminInput = z.infer<typeof updateAdminSchema>;
export type AdminIdParam = z.infer<typeof adminIdParamSchema>; 