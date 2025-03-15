import { Router } from "express";

const router: Router = Router();
import {
  CreatePetProfile,
  UpdatePetProfile,
  DeletePetProfile,
  petDetails,
  getAllPetProfilesForUser,
} from "../Controller/PetProfileController";
import { DeletePetForUser } from "../Controller/PetController";

router.post<{}, {}, petDetails>("/create-pet-profile", (req, res, next) => {
  CreatePetProfile(req, res).catch(next);
});
// Router definition
router.get<{ user_id: number }, {}>(
  "/get-pet-profile/:user_id",
  (req, res, next) => {
    getAllPetProfilesForUser(req, res).catch(next);
  },
);

router.put<{ pet_id: string }, {}, petDetails>(
  "/update-pet-profile/:pet_id",
  (req, res, next) => {
    UpdatePetProfile(req, res).catch(next);
  },
);

// router.delete<
//   { pet_id: number; PetProfile_id: number; user_id: number },
//   {},
//   {}
// >("/delete-pet-profile/:pet_id/:petProfile_id/:user_id", (req, res, next) => {
//   DeletePetProfile(req, res).catch(next);
// });

router.delete(
  "/delete-pet-profile/:pet_id/:petProfile_id/:user_id",
  (req, res, next) => {
    DeletePetProfile(req, res).catch(next);
  },
);
export default router;
