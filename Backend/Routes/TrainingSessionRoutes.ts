import { Router, Request, Response, NextFunction } from "express";
import v from "../Middleware/ValidationMiddleware";
import {
  authenticateUser,
  checkResourceOwnership,
} from "../Middleware/AuthMiddleware";
import {
  createTrainingSessionSchema,
  updateTrainingSessionSchema,
  sessionIdParamSchema,
  trainerIdParamSchema,
  CreateTrainingSessionInput,
  UpdateTrainingSessionInput,
  SessionIdParam,
  TrainerIdParam,
} from "../Validation/TrainingSessionSchema";
import {
  CreateTrainingSession,
  GetTrainingSession,
  GetTrainerSessions,
  UpdateTrainingSession,
  DeleteTrainingSession,
} from "../Controller/TrainingSessionController";

const router: Router = Router();

// Create training session route with validation and auth
router.post(
  "/create-session",
  authenticateUser,
  checkResourceOwnership,
  v(createTrainingSessionSchema),
  (req: Request<{}, {}, CreateTrainingSessionInput>, res: Response, next: NextFunction) => {
    CreateTrainingSession(req, res).catch(next);
  }
);

// Get training session by ID route with validation and auth
router.get(
  "/get-session/:session_id",
  authenticateUser,
  checkResourceOwnership,
  v(sessionIdParamSchema),
  (req: Request<{ session_id: string }>, res: Response, next: NextFunction) => {
    GetTrainingSession(req, res).catch(next);
  }
);

// Get all sessions for trainer route with validation and auth
router.get(
  "/trainer-sessions/:trainer_id",
  authenticateUser,
  checkResourceOwnership,
  v(trainerIdParamSchema),
  (req: Request<{ trainer_id: string }>, res: Response, next: NextFunction) => {
    GetTrainerSessions(req, res).catch(next);
  }
);

// Update training session route with validation and auth
router.put(
  "/update-session/:session_id",
  authenticateUser,
  checkResourceOwnership,
  v(updateTrainingSessionSchema),
  v(sessionIdParamSchema),
  (req: Request<{ session_id: string }, {}, UpdateTrainingSessionInput>, res: Response, next: NextFunction) => {
    UpdateTrainingSession(req, res).catch(next);
  }
);

// Delete training session route with validation and auth
router.delete(
  "/delete-session/:session_id",
  authenticateUser,
  checkResourceOwnership,
  v(sessionIdParamSchema),
  (req: Request<{ session_id: string }>, res: Response, next: NextFunction) => {
    DeleteTrainingSession(req, res).catch(next);
  }
);

export default router; 