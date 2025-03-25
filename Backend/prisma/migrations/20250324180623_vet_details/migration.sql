/*
  Warnings:

  - You are about to alter the column `specialty` on the `vets` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE "vets" ALTER COLUMN "specialty" SET NOT NULL,
ALTER COLUMN "specialty" SET DATA TYPE VARCHAR(100);
