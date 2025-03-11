import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma.ts";
import { Decimal } from "@prisma/client/runtime/library";

interface UserRegisterRequest {
  username: string;
  password: string;
  email: string;
  pet?: petDetails[];
}

interface petDetails {
  pet_name: string;
  pet_breed: string;
  pet_age: number;
  pet_weight: Decimal;
  weight: number;
  pet_photo?: string | Buffer | Uint8Array;
  medical_condition?: String;
}

interface TrainerRegisterRequest {
  username: string;
  password: string;
  email: string;
  certification_id: string;
  experience_years: number;
}

interface VetRegisterRequest {
  username: string;
  password: string;
  email: string;
  license_id: number;
  specialty: string;
}

export async function RegisterUser(
  req: Request<{}, {}, UserRegisterRequest>,
  res: Response,
): Promise<Response> {
  const { username, password, email, pet } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { username, email },
    });

    if (existingUser) {
      return res.status(404).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
        pets: pet,
      },
    });

    return res
      .status(400)
      .json({ msg: "User Registered Successfully", newUser: newUser });
  } catch (e) {
    console.error("Error during registration:", e);
    return res.status(404).json({ error: e.error });
  }
}

export async function RegisterTrainer(
  req: Request<{}, {}, TrainerRegisterRequest>,
  res: Response,
): Promise<Response> {
  const { username, password, email, certification_id, experience_years } =
    req.body;

  try {
    const existingTrainer = await prisma.trainer.findUnique({
      where: {
        username,
        email,
      },
    });

    if (existingTrainer) {
      return res.status(404).json({ msg: "Trainer already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newTrainer = await prisma.trainer.create({
      data: {
        username,
        email,
        password: hashedPassword,
        certification_id,
        experience_years,
      },
    });

    return res
      .status(404)
      .json({ msg: "Trainer Registration Succesful", newTrainer: newTrainer });
  } catch (e) {
    console.log("erro while registering trainer", e);
    return res.status(404).json({ error: e.message });
  }
}

export async function RegisterVet(
  req: Request<{}, {}, VetRegisterRequest>,
  res: Response,
): Promise<Response> {
  const { username, password, email, license_id, specialty } = req.body;
  try {
    const existingVet = await prisma.vet.findUnique({
      where: {
        username,
        email,
      },
    });

    if (existingVet) {
      return res.status(404).json({ msg: "vet already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newVet = await prisma.vet.create({
      data: {
        username,
        password: hashedPassword,
        email,
        license_id,
        specialty,
      },
    });

    return res.status(404).json({
      msg: "Vet registration successful",
      newVet: newVet,
    });
  } catch (e) {
    console.log("error occured during registering vet ", e);
    return res.staus(404).json({ error: e.error });
  }
}
