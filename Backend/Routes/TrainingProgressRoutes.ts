import { Router, Request, Response, NextFunction } from "express";
import v from "../Middleware/ValidationMiddleware";
import {
  authenticateUser,
  checkResourceOwnership,
} from "../Middleware/AuthMiddleware";
import {
  createTrainingProgressSchema,
  updateTrainingProgressSchema,
  progressIdParamSchema,
  trainerIdParamSchema,
  petIdParamSchema,
  CreateTrainingProgressInput,
  UpdateTrainingProgressInput,
  ProgressIdParam,
  TrainerIdParam,
  PetIdParam,
} from "../Validation/TrainingProgressSchema";
import {
  CreateTrainingProgress,
  GetTrainingProgress,
  GetTrainerProgress,
  GetPetProgress,
  UpdateTrainingProgress,
  DeleteTrainingProgress,
} from "../Controller/TrainingProgressController";

const router: Router = Router();

// Create training progress route with validation and auth
router.post(
  "/create-progress",
  authenticateUser,
  checkResourceOwnership,
  v(createTrainingProgressSchema),
  (req: Request<{}, {}, CreateTrainingProgressInput>, res: Response, next: NextFunction) => {
    CreateTrainingProgress(req, res).catch(next);
  }
);

// Get training progress by ID route with validation and auth
router.get(
  "/get-progress/:progress_id",
  authenticateUser,
  checkResourceOwnership,
  v(progressIdParamSchema),
  (req: Request<{ progress_id: string }>, res: Response, next: NextFunction) => {
    GetTrainingProgress(req, res).catch(next);
  }
);

// Get all progress for trainer route with validation and auth
router.get(
  "/trainer-progress/:trainer_id",
  authenticateUser,
  checkResourceOwnership,
  v(trainerIdParamSchema),
  (req: Request<{ trainer_id: string }>, res: Response, next: NextFunction) => {
    GetTrainerProgress(req, res).catch(next);
  }
);

// Get all progress for pet route with validation and auth
router.get(
  "/pet-progress/:pet_id",
  authenticateUser,
  checkResourceOwnership,
  v(petIdParamSchema),
  (req: Request<{ pet_id: string }>, res: Response, next: NextFunction) => {
    GetPetProgress(req, res).catch(next);
  }
);

// Update training progress route with validation and auth
router.put(
  "/update-progress/:progress_id",
  authenticateUser,
  checkResourceOwnership,
  v(updateTrainingProgressSchema),
  v(progressIdParamSchema),
  (req: Request<{ progress_id: string }, {}, UpdateTrainingProgressInput>, res: Response, next: NextFunction) => {
    UpdateTrainingProgress(req, res).catch(next);
  }
);

// Delete training progress route with validation and auth
router.delete(
  "/delete-progress/:progress_id",
  authenticateUser,
  checkResourceOwnership,
  v(progressIdParamSchema),
  (req: Request<{ progress_id: string }>, res: Response, next: NextFunction) => {
    DeleteTrainingProgress(req, res).catch(next);
  }
);

export default router; 