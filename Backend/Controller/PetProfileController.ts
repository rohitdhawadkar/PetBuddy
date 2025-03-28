import { Request, Response } from "express";
import { prisma } from "./prisma";
import { redis } from "./redis";
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
  req: Request<{ user_id: string }, {}, {}>,
  res: Response,
): Promise<void> {
  try {
    const { user_id } = req.params;
    const parsedUserId = parseInt(user_id, 10);

    if (!parsedUserId || isNaN(parsedUserId)) {
      res.status(400).json({ msg: "Invalid user ID" });
      return;
    }

    // Try to get cached data first
    const cacheKey = `user_pet_profiles:${parsedUserId}`;
    const cachedProfiles = await redis.get(cacheKey);

    if (cachedProfiles) {
      res.status(200).json(JSON.parse(cachedProfiles));
      return;
    }

    // Make the API call as needed
    const petResponse = await axios.get(
      `http://localhost:3000/pet/get-pet/${parsedUserId}`,
      {
        headers: {
          'Authorization': `Bearer ${req.headers.authorization?.split(' ')[1]}`
        }
      }
    );

    const pets = petResponse.data.allPets;
    console.log(pets);
    if (!pets || pets.length === 0) {
      res.status(404).json({ msg: "No pets found for this user" });
      return;
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

    const response = {
      pets: pets,
      petProfiles: petProfiles,
    };

    // Cache the response for 10 seconds
    await redis.setEx(cacheKey, 10, JSON.stringify(response));

    res.status(200).json(response);
  } catch (e) {
    console.error("Error occurred while retrieving pet profiles:", e);
    res.status(500).json({ msg: "Internal server error" });
  }
}

export async function CreatePetProfile(
  req: Request<{}, {}, petDetails>,
  res: Response,
): Promise<void> {
  try {
    const response = await axios.post(
      "http://localhost:3000/pet/Create-pet",
      req.body,
      {
        headers: {
          'Authorization': `Bearer ${req.headers.authorization?.split(' ')[1]}`
        }
      }
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

      // Invalidate cache for this user's pet profiles
      const cacheKey = `user_pet_profiles:${req.body.user_id}`;
      await redis.del(cacheKey);

      res.status(201).json({
        msg: "Pet profile created successfully",
        pet: newPet,
        profile: newPetProfile,
      });
    } else {
      res.status(200).json({
        msg: "Pet profile already exists",
        pet: newPet,
        profile: existingProfile,
      });
    }
  } catch (error) {
    console.error("Error occurred while creating pet profile:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
}

export async function UpdatePetProfile(
  req: Request<{ pet_id: string }, {}, petDetails>,
  res: Response,
): Promise<void> {
  try {
    const { pet_id } = req.params;
    const parsedPetId = parseInt(pet_id, 10);

    if (!parsedPetId || isNaN(parsedPetId)) {
      res.status(400).json({ msg: "Invalid pet ID" });
      return;
    }

    const response = await axios.put(
      `http://localhost:3000/pet/update-pet/${parsedPetId}`,
      req.body,
      {
        headers: {
          'Authorization': `Bearer ${req.headers.authorization?.split(' ')[1]}`
        }
      }
    );
    const UpdatedPet = response.data;

    // Invalidate cache for this user's pet profiles
    const cacheKey = `user_pet_profiles:${req.body.user_id}`;
    await redis.del(cacheKey);

    res.status(200).json({ msg: "PetProfileUpdated", UpdatedPet });
  } catch (e) {
    console.error("Error occurred while creating pet profile:", e);
    res.status(500).json({ msg: "Internal server error" });
  }
}

export async function DeletePetProfile(
  req: Request<{ petProfile_id: string; pet_id: string; user_id: string }, {}, {}>,
  res: Response,
): Promise<void> {
  try {
    console.log("Request params:", req.params); // Debug log

    const petProfile_id = parseInt(req.params.petProfile_id, 10);
    const pet_id = parseInt(req.params.pet_id, 10);
    const user_id = parseInt(req.params.user_id, 10);

    // Check if we have all required parameters
    if (isNaN(petProfile_id) || isNaN(pet_id) || isNaN(user_id)) {
      res.status(400).json({
        msg: "Invalid parameters",
        received: req.params,
      });
      return;
    }

    // Continue with the deletion...
    await prisma.petProfile.delete({
      where: {
        PetProfile_id: petProfile_id,
      },
    });

    const response = await axios.delete(
      `http://localhost:3000/pet/delete-pet/${pet_id}/${user_id}`,
      {
        headers: {
          'Authorization': `Bearer ${req.headers.authorization?.split(' ')[1]}`
        }
      }
    );

    // Invalidate cache for this user's pet profiles
    const cacheKey = `user_pet_profiles:${user_id}`;
    await redis.del(cacheKey);

    res.status(200).json({ msg: "Pet profile deleted successfully" });
  } catch (e) {
    console.error("Error occurred while deleting pet profile:", e);
    res.status(500).json({ msg: "Internal server error" });
  }
}
