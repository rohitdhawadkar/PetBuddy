import { Vet, Trainer, User, Clinic, WorkingHours } from "@prisma/client";

interface VetWithRelations extends Vet {
  clinic: Clinic;
  WorkingHours: WorkingHours[];
}

declare global {
  namespace Express {
    export interface Request {
      vet?: VetWithRelations;
      trainer?: Trainer;
      user?: User;
    }
  }
}

export {}; 