import { Router, Request, Response, NextFunction } from "express";
import v from "../Middleware/ValidationMiddleware";
import { adminAuth } from '../Middleware/adminAuth';
import asyncHandler from 'express-async-handler';
import {
  createAdminSchema,
  updateAdminSchema,
  adminIdParamSchema,
  adminLoginSchema,
  CreateAdminInput,
  UpdateAdminInput,
  AdminIdParam,
  AdminLoginInput,
} from "../Validation/AdminSchema";

import {
  CreateAdmin,
  GetAdmin,
  GetAllAdmins,
  UpdateAdmin,
  DeleteAdmin,
  AdminLogin,
  GetAdminStats,
  GetAllUsersWithDetails,
  GetAllVetsWithClinics,
  GetAllTrainersWithDetails,
} from "../Controller/AdminController";

const router: Router = Router();

// Admin login route
router.post(
  "/login",
  v(adminLoginSchema),
  asyncHandler(AdminLogin)
);

// Get admin stats route
router.get(
  "/stats",
  adminAuth,
  asyncHandler(GetAdminStats)
);

// Get all users with their details
router.get(
  "/users",
  adminAuth,
  asyncHandler(GetAllUsersWithDetails)
);

// Get all vets with their details
router.get(
  "/vets",
  adminAuth,
  asyncHandler(GetAllVetsWithClinics)
);

// Get all trainers with their details
router.get(
  "/trainers",
  adminAuth,
  asyncHandler(GetAllTrainersWithDetails)
);

// Create admin route
router.post(
  "/",
  adminAuth,
  v(createAdminSchema),
  asyncHandler(CreateAdmin)
);

// Get all admins route
router.get(
  "/",
  adminAuth,
  asyncHandler(GetAllAdmins)
);

// Get admin by ID route
router.get(
  "/:admin_id",
  adminAuth,
  v(adminIdParamSchema),
  asyncHandler(GetAdmin)
);

// Update admin route
router.put(
  "/:admin_id",
  adminAuth,
  v(adminIdParamSchema),
  v(updateAdminSchema),
  asyncHandler(UpdateAdmin)
);

// Delete admin route
router.delete(
  "/:admin_id",
  adminAuth,
  v(adminIdParamSchema),
  asyncHandler(DeleteAdmin)
);

export default router; 