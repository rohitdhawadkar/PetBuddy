import { Router, Request, Response, NextFunction } from "express";
import v from "../Middleware/ValidationMiddleware";
import {
  authenticateUser,
  checkResourceOwnership,
} from "../Middleware/AuthMiddleware";
import {
  createPetSchema,
  updatePetSchema,
  petIdParamSchema,
  userIdParamSchema,
  petAndUserIdParamsSchema,
  getPetByIdSchema,
  CreatePetInput,
  UpdatePetInput,
  PetIdParam,
  UserIdParam,
  PetAndUserIdParams,
  GetPetByIdInput,
} from "../Validation/PetSchema";

import {
  CreatePet,
  DeletePetForUser,
  UpdatePetForUser,
  getAllPetForUser,
  getPetForUserById,
} from "../Controller/PetController";

const router: Router = Router();

// Create pet route with validation and auth
router.post(
  "/Create-pet",
  authenticateUser,
  checkResourceOwnership,
  v(createPetSchema),
  (req: Request<{}, {}, CreatePetInput>, res: Response, next: NextFunction) => {
    CreatePet(req, res).catch(next);
  }
);

// Delete pet route with validation and auth
router.delete(
  "/delete-pet/:pet_id/:user_id",
  authenticateUser,
  checkResourceOwnership,
  v(petAndUserIdParamsSchema),
  (req: Request<PetAndUserIdParams>, res: Response, next: NextFunction) => {
    DeletePetForUser(req, res).catch(next);
  }
);

// Update pet route with validation and auth
router.put(
  "/update-pet/:pet_id",
  authenticateUser,
  checkResourceOwnership,
  v(updatePetSchema),
  v(petIdParamSchema),
  (req: Request<PetIdParam, {}, UpdatePetInput>, res: Response, next: NextFunction) => {
    UpdatePetForUser(req, res).catch(next);
  }
);

// Get pet by ID route with validation and auth
router.get(
  "/get-pet/:pet_id/:user_id",
  authenticateUser,
  checkResourceOwnership,
  v(petAndUserIdParamsSchema),
  (req: Request<PetAndUserIdParams>, res: Response, next: NextFunction) => {
    getPetForUserById(req, res).catch(next);
  }
);

// Get all pets for user route with validation and auth
router.get(
  "/get-pet/:user_id",
  authenticateUser,
  checkResourceOwnership,
  v(userIdParamSchema),
  (req: Request<UserIdParam>, res: Response, next: NextFunction) => {
    getAllPetForUser(req, res).catch(next);
  }
);

export default router;
