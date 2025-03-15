import { Request, Response } from "express";
import { prisma } from "./prisma";

import axios from "axios";

export interface petDetails {
  pet_name: string;
  breed: string;
  age: number;
  weight: number;

  pet_photo: Buffer<ArrayBufferLike> | Uint8Array<ArrayBufferLike> | null;
  medical_condition: string | null;
  user_id: number;
}

export async function getAllPetProfilesForUser(
  req: Request<{ user_id: number }, {}, {}>,
  res: Response,
) {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ msg: "User ID is required" });
    }

    // Make the API call as needed
    const petResponse = await axios.get(
      `http://localhost:3000/pet/get-pet/${user_id}`,
    );

    const pets = petResponse.data.allPets;
    console.log(pets);
    if (!pets || pets.length === 0) {
      return res.status(404).json({ msg: "No pets found for this user" });
    }

    // Get profiles for these pets
    const petProfiles = await prisma.petProfile.findMany({
      where: {
        Profile_pet_id: {
          in: pets.map((pet: { pet_id: number }) => pet.pet_id),
        },
      },
      include: {
        Pet: true, // Include the pet data if needed
      },
    });

    return res.status(200).json({
      pets: pets,
      petProfiles: petProfiles,
    });
  } catch (e) {
    console.error("Error occurred while retrieving pet profiles:", e);
    return res.status(500).json({ msg: "Internal server error" });
  }
}

export async function CreatePetProfile(
  req: Request<{}, {}, petDetails>,
  res: Response,
) {
  try {
    const response = await axios.post(
      "http://localhost:3000/pet/Create-pet",
      req.body,
    );

    const newPet = response.data.NewPet;

    const existingProfile = await prisma.petProfile.findUnique({
      where: { Profile_pet_id: newPet.pet_id },
    });

    if (!existingProfile) {
      const newPetProfile = await prisma.petProfile.create({
        data: {
          Profile_pet_id: newPet.pet_id,
        },
      });
      return res.status(201).json({
        msg: "Pet profile created successfully",
        pet: newPet,
        profile: newPetProfile,
      });
    } else {
      return res.status(200).json({
        msg: "Pet profile already exists",
        pet: newPet,
        profile: existingProfile,
      });
    }
  } catch (error) {
    console.error("Error occurred while creating pet profile:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
}

export async function UpdatePetProfile(
  req: Request<{ pet_id: string }, {}, petDetails>,
  res: Response,
) {
  try {
    const { pet_id } = req.params;
    const response = await axios.put(
      `http://localhost:3000/pet/update-pet/${pet_id}`,
      req.body,
    );
    const UpdatedPet = response.data;
    return res.status(404).json({ msg: "PetProfileUpdated", UpdatedPet });
  } catch (e) {
    console.error("Error occurred while creating pet profile:", e);
    return res.status(500).json({ msg: "Internal server error" });
  }
}

export async function DeletePetProfile(
  req: Request<any, {}, {}>,
  res: Response,
) {
  try {
    console.log("Request params:", req.params); // Debug log

    // Use optional chaining to avoid errors on undefined values
    const petProfile_id = req.params.petProfile_id
      ? parseInt(req.params.petProfile_id.toString(), 10)
      : null;
    const pet_id = req.params.pet_id
      ? parseInt(req.params.pet_id.toString(), 10)
      : null;
    const user_id = req.params.user_id
      ? parseInt(req.params.user_id.toString(), 10)
      : null;

    console.log("Parsed IDs:", { petProfile_id, pet_id, user_id }); // Debug log

    // Check if we have all required parameters
    if (!petProfile_id || !pet_id || !user_id) {
      return res.status(400).json({
        msg: "Missing required parameters",
        received: req.params,
      });
    }

    // Continue with the deletion...
    await prisma.petProfile.delete({
      where: {
        PetProfile_id: petProfile_id,
      },
    });

    const response = await axios.delete(
      `http://localhost:3000/pet/delete-pet/${pet_id}/${user_id}`,
    );

    return res.status(200).json({ msg: "Pet profile deleted successfully" });
  } catch (e) {
    console.error("Error occurred while deleting pet profile:", e);
    return res.status(500).json({ msg: "Internal server error" });
  }
}
