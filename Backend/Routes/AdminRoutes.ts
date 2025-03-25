import { Router, Request, Response, NextFunction } from "express";
import v from "../Middleware/ValidationMiddleware";
import { authenticateAdmin } from "../Middleware/AdminAuthMiddleware";
import {
  createAdminSchema,
  updateAdminSchema,
  adminIdParamSchema,
  CreateAdminInput,
  UpdateAdminInput,
  AdminIdParam,
} from "../Validation/AdminSchema";

import {
  CreateAdmin,
  GetAdmin,
  GetAllAdmins,
  UpdateAdmin,
  DeleteAdmin,
} from "../Controller/AdminController";

const router: Router = Router();

// Create admin route with validation and auth
router.post(
  "/create-admin",
  authenticateAdmin,
  v(createAdminSchema),
  (req: Request<{}, {}, CreateAdminInput>, res: Response, next: NextFunction) => {
    CreateAdmin(req, res).catch(next);
  }
);

// Get admin by ID route with validation and auth
router.get(
  "/get-admin/:admin_id",
  authenticateAdmin,
  v(adminIdParamSchema),
  (req: Request<AdminIdParam>, res: Response, next: NextFunction) => {
    GetAdmin(req, res).catch(next);
  }
);

// Get all admins route with auth
router.get(
  "/get-all-admins",
  authenticateAdmin,
  (req: Request, res: Response, next: NextFunction) => {
    GetAllAdmins(req, res).catch(next);
  }
);

// Update admin route with validation and auth
router.put(
  "/update-admin/:admin_id",
  authenticateAdmin,
  v(updateAdminSchema),
  v(adminIdParamSchema),
  (req: Request<AdminIdParam, {}, UpdateAdminInput>, res: Response, next: NextFunction) => {
    UpdateAdmin(req, res).catch(next);
  }
);

// Delete admin route with validation and auth
router.delete(
  "/delete-admin/:admin_id",
  authenticateAdmin,
  v(adminIdParamSchema),
  (req: Request<AdminIdParam>, res: Response, next: NextFunction) => {
    DeleteAdmin(req, res).catch(next);
  }
);

export default router; 