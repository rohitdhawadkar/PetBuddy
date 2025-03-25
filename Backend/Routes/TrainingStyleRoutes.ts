import { Router, Request, Response, NextFunction } from "express";
import v from "../Middleware/ValidationMiddleware";
import {
  authenticateUser,
  checkResourceOwnership,
} from "../Middleware/AuthMiddleware";
import {
  createTrainingStyleSchema,
  updateTrainingStyleSchema,
  styleIdParamSchema,
  trainerIdParamSchema,
  CreateTrainingStyleInput,
  UpdateTrainingStyleInput,
  StyleIdParam,
  TrainerIdParam,
} from "../Validation/TrainingStyleSchema";
import {
  CreateTrainingStyle,
  GetTrainingStyle,
  GetTrainerStyle,
  UpdateTrainingStyle,
  DeleteTrainingStyle,
} from "../Controller/TrainingStyleController";

const router: Router = Router();

// Create training style route with validation and auth
router.post(
  "/create-style",
  authenticateUser,
  checkResourceOwnership,
  v(createTrainingStyleSchema),
  (req: Request<{}, {}, CreateTrainingStyleInput>, res: Response, next: NextFunction) => {
    CreateTrainingStyle(req, res).catch(next);
  }
);

// Get training style by ID route with validation and auth
router.get(
  "/get-style/:style_id",
  authenticateUser,
  checkResourceOwnership,
  v(styleIdParamSchema),
  (req: Request<{ style_id: string }>, res: Response, next: NextFunction) => {
    GetTrainingStyle(req, res).catch(next);
  }
);

// Get training style by trainer ID route with validation and auth
router.get(
  "/trainer-style/:trainer_id",
  authenticateUser,
  checkResourceOwnership,
  v(trainerIdParamSchema),
  (req: Request<{ trainer_id: string }>, res: Response, next: NextFunction) => {
    GetTrainerStyle(req, res).catch(next);
  }
);

// Update training style route with validation and auth
router.put(
  "/update-style/:style_id",
  authenticateUser,
  checkResourceOwnership,
  v(updateTrainingStyleSchema),
  v(styleIdParamSchema),
  (req: Request<{ style_id: string }, {}, UpdateTrainingStyleInput>, res: Response, next: NextFunction) => {
    UpdateTrainingStyle(req, res).catch(next);
  }
);

// Delete training style route with validation and auth
router.delete(
  "/delete-style/:style_id",
  authenticateUser,
  checkResourceOwnership,
  v(styleIdParamSchema),
  (req: Request<{ style_id: string }>, res: Response, next: NextFunction) => {
    DeleteTrainingStyle(req, res).catch(next);
  }
);

export default router; 