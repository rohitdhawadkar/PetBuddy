import { Router, Request, Response, NextFunction } from "express";
import v from "../Middleware/ValidationMiddleware";
import {
  authenticateUser,
  checkResourceOwnership,
} from "../Middleware/AuthMiddleware";
import {
  createWorkingHoursSchema,
  updateWorkingHoursSchema,
  workingHoursIdParamSchema,
  trainerIdParamSchema,
  CreateWorkingHoursInput,
  UpdateWorkingHoursInput,
  WorkingHoursIdParam,
  TrainerIdParam,
} from "../Validation/TrainerWorkingHoursSchema";
import {
  CreateWorkingHours,
  GetWorkingHours,
  GetTrainerWorkingHours,
  UpdateWorkingHours,
  DeleteWorkingHours,
} from "../Controller/TrainerWorkingHoursController";

const router: Router = Router();

// Create working hours route with validation and auth
router.post(
  "/create-hours",
  authenticateUser,
  checkResourceOwnership,
  v(createWorkingHoursSchema),
  (req: Request<{}, {}, CreateWorkingHoursInput>, res: Response, next: NextFunction) => {
    CreateWorkingHours(req, res).catch(next);
  }
);

// Get working hours by ID route with validation and auth
router.get(
  "/get-hours/:working_hours_id",
  authenticateUser,
  checkResourceOwnership,
  v(workingHoursIdParamSchema),
  (req: Request<{ working_hours_id: string }>, res: Response, next: NextFunction) => {
    GetWorkingHours(req, res).catch(next);
  }
);

// Get all working hours for trainer route with validation and auth
router.get(
  "/trainer-hours/:trainer_id",
  authenticateUser,
  checkResourceOwnership,
  v(trainerIdParamSchema),
  (req: Request<{ trainer_id: string }>, res: Response, next: NextFunction) => {
    GetTrainerWorkingHours(req, res).catch(next);
  }
);

// Update working hours route with validation and auth
router.put(
  "/update-hours/:working_hours_id",
  authenticateUser,
  checkResourceOwnership,
  v(updateWorkingHoursSchema),
  v(workingHoursIdParamSchema),
  (req: Request<{ working_hours_id: string }, {}, UpdateWorkingHoursInput>, res: Response, next: NextFunction) => {
    UpdateWorkingHours(req, res).catch(next);
  }
);

// Delete working hours route with validation and auth
router.delete(
  "/delete-hours/:working_hours_id",
  authenticateUser,
  checkResourceOwnership,
  v(workingHoursIdParamSchema),
  (req: Request<{ working_hours_id: string }>, res: Response, next: NextFunction) => {
    DeleteWorkingHours(req, res).catch(next);
  }
);

export default router; 