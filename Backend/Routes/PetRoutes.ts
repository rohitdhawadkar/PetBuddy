import { Router } from "express";

const router: Router = Router();

import {
  CreatePet,
  petDetails,
  DeletePetForUser,
  UpdatePetForUser,
  getAllPetForUser,
  getPetForUserById,
} from "../Controller/PetController";

router.post<{}, {}, petDetails>("/Create-pet", (req, res, next) => {
  CreatePet(req, res).catch(next);
});

router.delete<{ pet_id: string; user_id: string }, {}, {}>(
  "/delete-pet/:pet_id/:user_id",
  (req, res, next) => {
    DeletePetForUser(req, res).catch(next);
  },
);

router.put<{ pet_id: string }, {}, petDetails>(
  "/update-pet/:pet_id",
  (req, res, next) => {
    UpdatePetForUser(req, res).catch(next);
  },
);

router.get<{ pet_id: number }, {}, { user_id: number }>(
  "/get-pet/${id}",
  (req, res, next) => {
    getPetForUserById(req, res).catch(next);
  },
);

router.get<{ user_id: string }, {}>("/get-pet/:user_id", (req, res, next) => {
  getAllPetForUser(req, res).catch(next);
});

export default router;
