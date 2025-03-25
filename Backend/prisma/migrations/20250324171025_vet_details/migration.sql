/*
  Warnings:

  - The `specialty` column on the `vets` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- AlterTable
ALTER TABLE "vets" ADD COLUMN     "clinic_id" INTEGER,
DROP COLUMN "specialty",
ADD COLUMN     "specialty" TEXT[];

-- CreateTable
CREATE TABLE "clinics" (
    "clinic_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip_code" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clinics_pkey" PRIMARY KEY ("clinic_id")
);

-- CreateTable
CREATE TABLE "working_hours" (
    "working_hours_id" SERIAL NOT NULL,
    "vet_id" INTEGER NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "working_hours_pkey" PRIMARY KEY ("working_hours_id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "appointment_id" SERIAL NOT NULL,
    "vet_id" INTEGER NOT NULL,
    "pet_id" INTEGER NOT NULL,
    "appointment_date" TIMESTAMP(3) NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED',
    "notes" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("appointment_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "working_hours_vet_id_day_of_week_key" ON "working_hours"("vet_id", "day_of_week");

-- AddForeignKey
ALTER TABLE "vets" ADD CONSTRAINT "vets_clinic_id_fkey" FOREIGN KEY ("clinic_id") REFERENCES "clinics"("clinic_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "working_hours" ADD CONSTRAINT "working_hours_vet_id_fkey" FOREIGN KEY ("vet_id") REFERENCES "vets"("vet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_vet_id_fkey" FOREIGN KEY ("vet_id") REFERENCES "vets"("vet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pets"("pet_id") ON DELETE RESTRICT ON UPDATE CASCADE;
