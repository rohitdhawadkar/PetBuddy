import { Router, Request, Response, NextFunction } from "express";
import v from "../Middleware/ValidationMiddleware";
import { authenticateAdmin } from "../Middleware/AdminAuthMiddleware";
import { authenticateVet } from "../Middleware/VetAuthMiddleware";
import {
  CreateVet,
  GetVet,
  UpdateVet,
  DeleteVet,
} from "../Controller/VetController";
import {
  createVetSchema,
  updateVetSchema,
  vetIdParamSchema,
  CreateVetInput,
  UpdateVetInput,
  VetIdParam,
} from "../Validation/VetSchema";

const router: Router = Router();

// Vet Routes - Admin only for creation and deletion
router.post(
  "/create-vet",
 
  v(createVetSchema),
  (req: Request<{}, {}, CreateVetInput>, res: Response, next: NextFunction) => {
    CreateVet(req, res).catch(next);
  }
);

router.get(
  "/get-vet/:vet_id",
  authenticateVet,
  v(vetIdParamSchema),
  (req: Request<{ vet_id: string }, {}, {}>, res: Response, next: NextFunction) => {
    GetVet(req, res).catch(next);
  }
);

// Vet can update their own profile or admin can update any vet
router.put(
  "/update-vet/:vet_id",
  authenticateVet,
  v(updateVetSchema),
  v(vetIdParamSchema),
  (req: Request<{ vet_id: string }, {}, UpdateVetInput>, res: Response, next: NextFunction) => {
    UpdateVet(req, res).catch(next);
  }
);

router.delete(
  "/delete-vet/:vet_id",
  authenticateAdmin,
  v(vetIdParamSchema),
  (req: Request<{ vet_id: string }, {}, {}>, res: Response, next: NextFunction) => {
    DeleteVet(req, res).catch(next);
  }
);

export default router; 