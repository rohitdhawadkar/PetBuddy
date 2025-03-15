import { Request, Response } from "express";
import { prisma } from "./prisma";

export interface petDetails {
  pet_name: string;
  breed: string;
  age: number;
  weight: number;

  pet_photo: Buffer<ArrayBufferLike> | Uint8Array<ArrayBufferLike> | null;
  medical_condition: string | null;
  user_id: number;
}

export async function CreatePet(
  req: Request<{}, {}, petDetails>,
  res: Response,
): Promise<Response> {
  const {
    pet_name,
    breed,
    age,
    weight,
    pet_photo,
    medical_condition,
    user_id,
  } = req.body;
  try {
    const NewPet = await prisma.pet.create({
      data: {
        pet_name,
        breed,
        age,
        weight,
        pet_photo,
        medical_condition,
        user_id,
      },
    });
    return res.status(201).json({ NewPet });
  } catch (e) {
    console.log("Error occured while adding pet", e);
    return res.status(404).json({ msg: "Error occured while adding pet" });
  }
}

export async function getAllPetForUser(
  req: Request<{ user_id: string }, {}>,
  res: Response,
): Promise<Response> {
  const user_id = parseInt(req.params.user_id, 10);

  try {
    if (!user_id) {
      return res.status(400).json({ msg: "User ID is required" });
    }

    const allPets = await prisma.pet.findMany({
      where: {
        user_id, // Correct way to specify the where clause
      },
    });

    if (allPets.length === 0) {
      return res.status(404).json({ msg: "No pets found for this user" });
    }

    return res.status(200).json({ allPets });
  } catch (e) {
    console.log("Error occurred while finding pets", e);
    return res.status(500).json({ msg: "Error occurred while finding pets" });
  }
}

export async function getPetForUserById(
  req: Request<{ pet_id: number }, {}, { user_id: number }>,
  res: Response,
) {
  const { pet_id } = req.params;
  const { user_id } = req.body;

  try {
    const pet = await prisma.pet.findUnique({
      where: {
        user_id,
        pet_id,
      },
    });
    if (!pet) {
      return res.status(404).json({ msg: "pet not found" });
    }

    return res.status(201).json({ pet });
  } catch (e) {
    console.log("Error occured while finding pet", e);
    return res.status(404).json({ msg: "Error occured while finding pet" });
  }
}

export async function UpdatePetForUser(
  req: Request<{ pet_id: string }, {}, petDetails>,
  res: Response,
): Promise<Response> {
  const { pet_id } = req.params;
  try {
    const pet_id = parseInt(req.params.pet_id, 10);
    const {
      pet_name,
      breed,
      age,
      weight,
      pet_photo,
      medical_condition,
      user_id,
    } = req.body;

    const existingPet = await prisma.pet.findFirst({
      where: {
        pet_id,
        user_id,
      },
    });

    if (!existingPet) {
      return res
        .status(404)
        .json({ msg: "Pet not found or does not belong to user" });
    }
    const updatedPet = await prisma.pet.update({
      where: { pet_id },
      data: {
        pet_name,
        breed,
        age,
        weight,
        pet_photo,
        medical_condition,
      },
    });
    return res
      .status(200)
      .json({ msg: "Pet updated successfully", pet: updatedPet });
  } catch (error) {
    console.error("Error updating pet:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
}

export async function DeletePetForUser(
  req: Request<{ pet_id: string; user_id: string }, {}, {}>,
  res: Response,
): Promise<Response> {
  const { pet_id, user_id } = req.params;

  try {
    const pet_id = parseInt(req.params.pet_id, 10);
    const user_id = parseInt(req.params.user_id, 10);
    const existingPet = await prisma.pet.findFirst({
      where: {
        pet_id,
        user_id,
      },
    });

    if (!existingPet) {
      return res
        .status(404)
        .json({ msg: "Pet not found or does not belong to user" });
    }
    await prisma.pet.delete({
      where: {
        pet_id: existingPet.pet_id, // Assuming pet_id is the primary key
      },
    });

    return res.status(200).json({ msg: "Pet deleted successfully" });
  } catch (error) {
    console.error("Error deleting pet:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
}
