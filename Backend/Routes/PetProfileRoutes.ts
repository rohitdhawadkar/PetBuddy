import { Router, Request, Response, NextFunction } from "express";
import {
  authenticateUser,
  checkResourceOwnership,
} from "../Middleware/AuthMiddleware";
import {
  CreatePetProfile,
  UpdatePetProfile,
  DeletePetProfile,
  getAllPetProfilesForUser,
} from "../Controller/PetProfileController";
import { PetIdParam, UserIdParam, PetAndUserIdParams } from "../Validation/PetSchema";

const router: Router = Router();

router.get(
  "/get-pet-profile/:user_id",
  authenticateUser,
  // checkResourceOwnership,
  (req: Request<UserIdParam>, res: Response, next: NextFunction) => {
    getAllPetProfilesForUser(req, res).catch(next);
  }
);

// Create pet profile
router.post(
  "/create-pet-profile",
  authenticateUser,
  checkResourceOwnership,
  (req: Request, res: Response, next: NextFunction) => {
    CreatePetProfile(req, res).catch(next);
  }
);

// Update pet profile
router.put(
  "/update-pet-profile/:pet_id",
  authenticateUser,
  checkResourceOwnership,
  (req: Request<PetIdParam>, res: Response, next: NextFunction) => {
    UpdatePetProfile(req, res).catch(next);
  }
);

// Delete pet profile
router.delete(
  "/delete-pet-profile/:petProfile_id/:pet_id/:user_id",
  authenticateUser,
  checkResourceOwnership,
  (req: Request<PetAndUserIdParams & { petProfile_id: string }>, res: Response, next: NextFunction) => {
    DeletePetProfile(req, res).catch(next);
  }
);

export default router;
