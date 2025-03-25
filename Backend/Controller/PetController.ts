import { Request, Response } from "express";
import { prisma } from "./prisma";
import { redis } from "./redis";
import { CreatePetInput, UpdatePetInput, PetIdParam, UserIdParam, PetAndUserIdParams, GetPetByIdInput } from "../Validation/PetSchema";

export type petDetails = CreatePetInput;

export async function CreatePet(
  req: Request<{}, {}, CreatePetInput>,
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
  req: Request<UserIdParam>,
  res: Response,
): Promise<Response> {
  const user_id = parseInt(req.params.user_id, 10);

  try {
    if (!user_id) {
      return res.status(400).json({ msg: "User ID is required" });
    }

    const cacheKey = `user_pets:${user_id}`;
    const cachedPets = await redis.get(cacheKey);

    if (cachedPets) {
      return res.status(200).json({ allPets: JSON.parse(cachedPets) });
    }

    const allPets = await prisma.pet.findMany({
      where: { user_id },
    });

    if (allPets.length === 0) {
      return res.status(404).json({ msg: "No pets found for this user" });
    }

    await redis.setEx(cacheKey, 10, JSON.stringify(allPets));

    return res.status(200).json({ allPets });
  } catch (e) {
    console.error("Error occurred while finding pets", e);
    return res.status(500).json({ msg: "Error occurred while finding pets" });
  }
}

export const getPetForUserById = async (req: Request<GetPetByIdInput>, res: Response) => {
  try {
    const { user_id, pet_id } = req.params;
    const parsedUserId = parseInt(user_id);
    const parsedPetId = parseInt(pet_id);

    const pet = await prisma.pet.findFirst({
      where: {
        pet_id: parsedPetId,
        user_id: parsedUserId,
      },
    });

    if (!pet) {
      return res.status(404).json({
        message: "Pet not found",
      });
    }

    return res.status(200).json({
      message: "Pet retrieved successfully",
      data: pet,
    });
  } catch (error) {
    console.error("Error in getPetForUserById:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

export async function UpdatePetForUser(
  req: Request<PetIdParam, {}, UpdatePetInput>,
  res: Response,
): Promise<Response> {
  const { pet_id } = req.params;
  try {
    const parsedPetId = parseInt(pet_id, 10);
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
        pet_id: parsedPetId,
        user_id,
      },
    });

    if (!existingPet) {
      return res
        .status(404)
        .json({ msg: "Pet not found or does not belong to user" });
    }
    const updatedPet = await prisma.pet.update({
      where: { pet_id: parsedPetId },
      data: {
        pet_name,
        breed,
        age,
        weight,
        pet_photo,
        medical_condition,
      },
    });

    // Remove the cached data for this user's pets
    const cacheKey = `user_pets:${user_id}`;
    await redis.del(cacheKey);

    return res
      .status(200)
      .json({ msg: "Pet updated successfully", pet: updatedPet });
  } catch (error) {
    console.error("Error updating pet:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
}

export async function DeletePetForUser(
  req: Request<PetAndUserIdParams>,
  res: Response,
): Promise<Response> {
  const { pet_id, user_id } = req.params;

  try {
    const parsedPetId = parseInt(pet_id, 10);
    const parsedUserId = parseInt(user_id, 10);
    const existingPet = await prisma.pet.findFirst({
      where: {
        pet_id: parsedPetId,
        user_id: parsedUserId,
      },
    });

    if (!existingPet) {
      return res
        .status(404)
        .json({ msg: "Pet not found or does not belong to user" });
    }
    await prisma.pet.delete({
      where: {
        pet_id: existingPet.pet_id,
      },
    });

    // Remove the cached data for this user's pets
    const cacheKey = `user_pets:${parsedUserId}`;
    await redis.del(cacheKey);

    return res.status(200).json({ msg: "Pet deleted successfully" });
  } catch (error) {
    console.error("Error deleting pet:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
}
