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

import v from "../Middleware/ValidationMiddleware";
import {
  userRegisterSchema,
  loginSchema,
  trainerRegisterSchema,
  vetRegisterSchema,
} from "../Validation/AuthSchema";

import { Router } from "express";

const router: Router = Router();

router.post<{}, {}, UserRegisterRequest>(
  "/user-register",
  v(userRegisterSchema), // Validation middleware first
  async (req, res, next) => {
    try {
      await RegisterUser(req, res);
    } catch (error) {
      next(error); // Properly pass errors to Express error handling middleware
    }
  },
);

router.post<{}, {}, TrainerRegisterRequest>(
  "/trainer-register",
  (req, res, next) => {
    RegisterTrainer(req, res).catch(next);
  },
);

router.post<{}, {}, VetRegisterRequest>(
  "/vet-register",
  v(vetRegisterSchema),
  (req, res, next) => {
    RegisterVet(req, res).catch(next);
  },
);

router.post<{}, {}, LoginRequest>(
  "/user-login",
  v(loginSchema),
  (req, res, next) => {
    LoginUser(req, res).catch(next);
  },
);

router.post<{}, {}, LoginRequest>("/trainer-login", (req, res, next) => {
  LoginTrainer(req, res).catch(next);
});

router.post<{}, {}, LoginRequest>("/vet-login", (req, res, next) => {
  LoginVet(req, res).catch(next);
});

export default router;
