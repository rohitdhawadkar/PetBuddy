import { Request, Response } from "express";
import { prisma } from "./prisma";
import { Prisma } from "@prisma/client";

export interface ClinicInput {
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string;
  email?: string;
  website?: string;
}

export async function CreateClinic(
  req: Request<{}, {}, ClinicInput>,
  res: Response
): Promise<Response> {
  const { name, address, city, state, zip_code, phone, email, website } = req.body;

  try {
    // Check if clinic with same name exists
    const existingClinic = await prisma.clinic.findFirst({
      where: {
        name,
        address,
      },
    });

    if (existingClinic) {
      return res.status(400).json({ msg: "Clinic with this name and address already exists" });
    }

    const newClinic = await prisma.clinic.create({
      data: {
        name,
        address,
        city,
        state,
        zip_code,
        phone,
        email,
        website,
      },
    });

    return res.status(201).json({
      msg: "Clinic created successfully",
      clinic: newClinic,
    });
  } catch (error) {
    console.error("Error creating clinic:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
}

export async function GetClinic(
  req: Request<{ id: string }>,
  res: Response
): Promise<Response> {
  const { id } = req.params;

  try {
    const clinic = await prisma.clinic.findUnique({
      where: {
        clinic_id: parseInt(id),
      },
      include: {
        vets: true,
      },
    });

    if (!clinic) {
      return res.status(404).json({ msg: "Clinic not found" });
    }

    return res.status(200).json({
      msg: "Clinic retrieved successfully",
      clinic,
    });
  } catch (error) {
    console.error("Error retrieving clinic:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
}

export async function GetAllClinics(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const clinics = await prisma.clinic.findMany({
      include: {
        vets: true,
      },
    });

    return res.status(200).json({
      msg: "Clinics retrieved successfully",
      clinics,
    });
  } catch (error) {
    console.error("Error retrieving clinics:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
}

export async function UpdateClinic(
  req: Request<{ id: string }, {}, Partial<ClinicInput>>,
  res: Response
): Promise<Response> {
  const { id } = req.params;
  const updateData = req.body;

  try {
    // Check if clinic exists
    const existingClinic = await prisma.clinic.findUnique({
      where: {
        clinic_id: parseInt(id),
      },
    });

    if (!existingClinic) {
      return res.status(404).json({ msg: "Clinic not found" });
    }

    // If name and address are being updated, check for duplicates
    if (updateData.name && updateData.address) {
      const duplicateClinic = await prisma.clinic.findFirst({
        where: {
          name: updateData.name,
          address: updateData.address,
          clinic_id: {
            not: parseInt(id),
          },
        },
      });

      if (duplicateClinic) {
        return res.status(400).json({ msg: "Clinic with this name and address already exists" });
      }
    }

    const updatedClinic = await prisma.clinic.update({
      where: {
        clinic_id: parseInt(id),
      },
      data: updateData,
      include: {
        vets: true,
      },
    });

    return res.status(200).json({
      msg: "Clinic updated successfully",
      clinic: updatedClinic,
    });
  } catch (error) {
    console.error("Error updating clinic:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
}

export async function DeleteClinic(
  req: Request<{ id: string }>,
  res: Response
): Promise<Response> {
  const { id } = req.params;

  try {
    // Check if clinic exists
    const existingClinic = await prisma.clinic.findUnique({
      where: {
        clinic_id: parseInt(id),
      },
    });

    if (!existingClinic) {
      return res.status(404).json({ msg: "Clinic not found" });
    }

    // Check if clinic has associated vets
    const clinicWithVets = await prisma.clinic.findUnique({
      where: {
        clinic_id: parseInt(id),
      },
      include: {
        vets: true,
      },
    });

    if (clinicWithVets?.vets && clinicWithVets.vets.length > 0) {
      return res.status(400).json({ 
        msg: "Cannot delete clinic with associated vets. Please reassign or remove vets first." 
      });
    }

    await prisma.clinic.delete({
      where: {
        clinic_id: parseInt(id),
      },
    });

    return res.status(200).json({
      msg: "Clinic deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting clinic:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
} 