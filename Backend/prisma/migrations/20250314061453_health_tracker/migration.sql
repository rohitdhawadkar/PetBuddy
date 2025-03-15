/*
  Warnings:

  - You are about to drop the column `userUser_id` on the `pets` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Active', 'Completed');

-- DropForeignKey
ALTER TABLE "pets" DROP CONSTRAINT "pets_userUser_id_fkey";

-- AlterTable
ALTER TABLE "pets" DROP COLUMN "userUser_id",
ADD COLUMN     "user_id" INTEGER;

-- CreateTable
CREATE TABLE "PetProfile" (
    "PetProfile_id" SERIAL NOT NULL,
    "Profile_pet_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PetProfile_pkey" PRIMARY KEY ("PetProfile_id")
);

-- CreateTable
CREATE TABLE "HealthTracker" (
    "HealthTrackr_id" SERIAL NOT NULL,
    "h_petProfile_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HealthTracker_pkey" PRIMARY KEY ("HealthTrackr_id")
);

-- CreateTable
CREATE TABLE "WeightTracking" (
    "Weight_Tracking_id" SERIAL NOT NULL,
    "health_tracker_id" INTEGER NOT NULL,
    "Weight" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeightTracking_pkey" PRIMARY KEY ("Weight_Tracking_id")
);

-- CreateTable
CREATE TABLE "MedicalRecord" (
    "Medical_record_id" SERIAL NOT NULL,
    "health_tracker_id" INTEGER NOT NULL,
    "record_type" VARCHAR(50) NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "vet_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicalRecord_pkey" PRIMARY KEY ("Medical_record_id")
);

-- CreateTable
CREATE TABLE "DietPlan" (
    "diet_plan_id" SERIAL NOT NULL,
    "health_tracker_id" INTEGER NOT NULL,
    "plan_name" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL,
    "notes" VARCHAR(500) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DietPlan_pkey" PRIMARY KEY ("diet_plan_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PetProfile_Profile_pet_id_key" ON "PetProfile"("Profile_pet_id");

-- CreateIndex
CREATE UNIQUE INDEX "HealthTracker_h_petProfile_id_key" ON "HealthTracker"("h_petProfile_id");

-- CreateIndex
CREATE UNIQUE INDEX "WeightTracking_health_tracker_id_key" ON "WeightTracking"("health_tracker_id");

-- CreateIndex
CREATE UNIQUE INDEX "MedicalRecord_health_tracker_id_key" ON "MedicalRecord"("health_tracker_id");

-- CreateIndex
CREATE UNIQUE INDEX "DietPlan_health_tracker_id_key" ON "DietPlan"("health_tracker_id");

-- AddForeignKey
ALTER TABLE "pets" ADD CONSTRAINT "pets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetProfile" ADD CONSTRAINT "PetProfile_Profile_pet_id_fkey" FOREIGN KEY ("Profile_pet_id") REFERENCES "pets"("pet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthTracker" ADD CONSTRAINT "HealthTracker_h_petProfile_id_fkey" FOREIGN KEY ("h_petProfile_id") REFERENCES "PetProfile"("PetProfile_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeightTracking" ADD CONSTRAINT "WeightTracking_health_tracker_id_fkey" FOREIGN KEY ("health_tracker_id") REFERENCES "HealthTracker"("HealthTrackr_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalRecord" ADD CONSTRAINT "MedicalRecord_health_tracker_id_fkey" FOREIGN KEY ("health_tracker_id") REFERENCES "HealthTracker"("HealthTrackr_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalRecord" ADD CONSTRAINT "MedicalRecord_vet_id_fkey" FOREIGN KEY ("vet_id") REFERENCES "vets"("vet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DietPlan" ADD CONSTRAINT "DietPlan_health_tracker_id_fkey" FOREIGN KEY ("health_tracker_id") REFERENCES "HealthTracker"("HealthTrackr_id") ON DELETE RESTRICT ON UPDATE CASCADE;
