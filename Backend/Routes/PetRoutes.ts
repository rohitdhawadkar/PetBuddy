import { Router, Request, Response, NextFunction } from "express";
import v from "../Middleware/ValidationMiddleware";
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

// Create pet route with validation
router.post(
  "/Create-pet",
  v(createPetSchema),
  (req: Request<{}, {}, CreatePetInput>, res: Response, next: NextFunction) => {
    CreatePet(req, res).catch(next);
  }
);

// Delete pet route with validation for both params
router.delete(
  "/delete-pet/:pet_id/:user_id",
  v(petAndUserIdParamsSchema),
  (req: Request<PetAndUserIdParams>, res: Response, next: NextFunction) => {
    DeletePetForUser(req, res).catch(next);
  }
);

// Update pet route with validation for both body and params
router.put(
  "/update-pet/:pet_id",
  v(updatePetSchema),
  v(petIdParamSchema),
  (req: Request<PetIdParam, {}, UpdatePetInput>, res: Response, next: NextFunction) => {
    UpdatePetForUser(req, res).catch(next);
  }
);

// Get pet by ID route with validation for both body and params
router.get(
  "/get-pet/:pet_id",
  v(getPetByIdSchema),
  v(petIdParamSchema),
  (req: Request<PetIdParam, {}, GetPetByIdInput>, res: Response, next: NextFunction) => {
    getPetForUserById(req, res).catch(next);
  }
);

// Get all pets for user route with validation for params
router.get(
  "/get-pet/:user_id",
  v(userIdParamSchema),
  (req: Request<UserIdParam>, res: Response, next: NextFunction) => {
    getAllPetForUser(req, res).catch(next);
  }
);

export default router;
