import {
  RegisterUser,
  RegisterVet,
  RegisterTrainer,
  UserRegisterRequest,
  TrainerRegisterRequest,
  VetRegisterRequest,
  LoginUser,
  LoginRequest,
  LoginVet,
  LoginTrainer,
} from "../Controller/AuthController";

import { Router } from "express";

const router: Router = Router();

router.post<{}, {}, UserRegisterRequest>("/user-register", (req, res, next) => {
  RegisterUser(req, res).catch(next);
});
router.post<{}, {}, TrainerRegisterRequest>(
  "/trainer-register",
  (req, res, next) => {
    RegisterTrainer(req, res).catch(next);
  },
);

router.post<{}, {}, VetRegisterRequest>("/vet-register", (req, res, next) => {
  RegisterVet(req, res).catch(next);
});

router.post<{}, {}, LoginRequest>("/user-login", (req, res, next) => {
  LoginUser(req, res).catch(next);
});

router.post<{}, {}, LoginRequest>("/trainer-login", (req, res, next) => {
  LoginTrainer(req, res).catch(next);
});

router.post<{}, {}, LoginRequest>("/vet-login", (req, res, next) => {
  LoginVet(req, res).catch(next);
});

export default router;
