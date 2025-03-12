import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { Prisma } from "@prisma/client";

export interface UserRegisterRequest {
  username: string;
  password: string;
  email: string;
  pets?: petDetails[];
}

export interface LoginRequest {
  username: string | null;
  email: string | null;
  password: string;
}

interface petDetails {
  pet_name: string;
  breed: string;
  age: number;
  weight: number;

  pet_photo: Buffer<ArrayBufferLike> | Uint8Array<ArrayBufferLike> | null;
  medical_condition: string | null;
}

export interface TrainerRegisterRequest {
  username: string;
  password: string;
  email: string;
  certification_id: string;
  experience_years: number;
}

export interface VetRegisterRequest {
  username: string;
  password: string;
  email: string;
  license_id: string;
  specialty: string;
}

export async function RegisterUser(
  req: Request<{}, {}, UserRegisterRequest>,
  res: Response,
): Promise<Response> {
  const { username, password, email, pets } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { username, email },
    });

    if (existingUser) {
      return res.status(404).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Ensure pets is correctly formatted to Prisma's expected type
    const formattedPets: Prisma.PetCreateWithoutUserInput[] =
      pets?.map((pet) => ({
        pet_name: pet.pet_name,
        breed: pet.breed,
        age: pet.age,
        weight: pet.weight,
        pet_photo: pet.pet_photo ?? null, // Ensure nullable binary field is handled correctly
        medical_condition: pet.medical_condition ?? null, // Ensure nullable string field is handled correctly
      })) || [];

    // Create the new user with nested pet data
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
        pets: {
          create: formattedPets, // Create related pets
        },
      },
    });

    return res
      .status(201)
      .json({ msg: "User Registered Successfully", newUser });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ msg: "Internal server error" });
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
    return res.status(404).json({ msg: "enternal server error" });
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
    return res.status(404).json({ msg: "internal server error" });
  }
}

export async function LoginUser(
  req: Request<{}, {}, LoginRequest>,
  res: Response,
): Promise<Response> {
  const { username, email, password } = req.body;

  if (username && email) {
    return res
      .status(404)
      .json({ msg: "provide only one of username or email" });
  }

  if (!username && !email) {
    return res.status(404).json({ msg: "provide atleast username or email" });
  }

  try {
    const whereClause: any = {};
    if (username) {
      whereClause.username = username;
    } else {
      whereClause.username = email;
    }

    const User = await prisma.user.findUnique({
      where: whereClause,
    });

    if (!User) {
      return res.status(404).json({ msg: "user does not exist" });
    }

    const isPasswordValid = await bcrypt.compare(password, User.password);

    if (!isPasswordValid) {
      return res.status(404).json({ msg: "incorrect password" });
    }

    const token = jwt.sign(
      { user_id: User.user_id, username: User.username },
      process.env.JWT_SECRET || "jwt_secret",
      { expiresIn: "1h" },
    );

    return res.status(200).json({
      msg: "Login successful",
      token,
      user: {
        user_id: User.user_id,
        username: User.username,
        email: User.email,
      },
    });
  } catch (e) {
    console.log("error while logging in", e);
    return res.status(404).json({
      msg: "error",
    });
  }
}

export async function LoginTrainer(
  req: Request<{}, {}, LoginRequest>,
  res: Response,
): Promise<Response> {
  const { username, email, password } = req.body;

  if (username && email) {
    return res
      .status(404)
      .json({ msg: "provide only one of username or email" });
  }

  if (!username && !email) {
    return res.status(404).json({ msg: "provide atleast username or email" });
  }

  try {
    const whereClause: any = {};
    if (username) {
      whereClause.username = username;
    } else {
      whereClause.username = email;
    }

    const Trainer = await prisma.trainer.findUnique({
      where: whereClause,
    });

    if (!Trainer) {
      return res.status(404).json({ msg: "user does not exist" });
    }

    const isPasswordValid = await bcrypt.compare(password, Trainer.password);

    if (!isPasswordValid) {
      return res.status(404).json({ msg: "incorrect password" });
    }

    const token = jwt.sign(
      { trainer_id: Trainer.trainer_id, username: Trainer.username },
      process.env.JWT_SECRET || "jwt_secret",
      { expiresIn: "1h" },
    );

    return res.status(200).json({
      msg: "Login successful",
      token,
      user: {
        user_id: Trainer.trainer_id,
        username: Trainer.username,
        email: Trainer.email,
      },
    });
  } catch (e) {
    console.log("error while logging in", e);
    return res.status(404).json({
      msg: "error",
    });
  }
}

export async function LoginVet(
  req: Request<{}, {}, LoginRequest>,
  res: Response,
): Promise<Response> {
  const { username, email, password } = req.body;

  if (username && email) {
    return res
      .status(404)
      .json({ msg: "provide only one of username or email" });
  }

  if (!username && !email) {
    return res.status(404).json({ msg: "provide atleast username or email" });
  }

  try {
    const whereClause: any = {};
    if (username) {
      whereClause.username = username;
    } else {
      whereClause.username = email;
    }

    const vet = await prisma.vet.findUnique({
      where: whereClause,
    });

    if (!vet) {
      return res.status(404).json({ msg: "user does not exist" });
    }

    const isPasswordValid = await bcrypt.compare(password, vet.password);

    if (!isPasswordValid) {
      return res.status(404).json({ msg: "incorrect password" });
    }

    const token = jwt.sign(
      { vet_id: vet.vet_id, username: vet.username },
      process.env.JWT_SECRET || "jwt_secret",
      { expiresIn: "1h" },
    );

    return res.status(200).json({
      msg: "Login successful",
      token,
      user: {
        user_id: vet.vet_id,
        username: vet.username,
        email: vet.email,
      },
    });
  } catch (e) {
    console.log("error while logging in", e);
    return res.status(404).json({
      msg: "error",
    });
  }
}
