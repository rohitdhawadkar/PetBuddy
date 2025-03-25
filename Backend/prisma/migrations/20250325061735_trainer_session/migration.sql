-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('PRIVATE', 'GROUP', 'BEHAVIORAL', 'AGILITY', 'OBEDIENCE', 'PUPPY', 'ADVANCED');

-- CreateTable
CREATE TABLE "training_styles" (
    "style_id" SERIAL NOT NULL,
    "trainer_id" INTEGER NOT NULL,
    "primary_style" VARCHAR(50) NOT NULL,
    "secondary_style" VARCHAR(50),
    "methodology" VARCHAR(500) NOT NULL,
    "specializations" TEXT[],
    "certifications" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "training_styles_pkey" PRIMARY KEY ("style_id")
);

-- CreateTable
CREATE TABLE "trainer_working_hours" (
    "working_hours_id" SERIAL NOT NULL,
    "trainer_id" INTEGER NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trainer_working_hours_pkey" PRIMARY KEY ("working_hours_id")
);

-- CreateTable
CREATE TABLE "training_sessions" (
    "session_id" SERIAL NOT NULL,
    "trainer_id" INTEGER NOT NULL,
    "pet_id" INTEGER NOT NULL,
    "session_date" TIMESTAMP(3) NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'SCHEDULED',
    "session_type" "SessionType" NOT NULL,
    "focus_areas" TEXT[],
    "notes" VARCHAR(500),
    "progress_notes" VARCHAR(1000),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "training_sessions_pkey" PRIMARY KEY ("session_id")
);

-- CreateTable
CREATE TABLE "training_progress" (
    "progress_id" SERIAL NOT NULL,
    "trainer_id" INTEGER NOT NULL,
    "pet_id" INTEGER NOT NULL,
    "skill_name" VARCHAR(100) NOT NULL,
    "current_level" INTEGER NOT NULL,
    "target_level" INTEGER NOT NULL,
    "last_assessed" TIMESTAMP(3) NOT NULL,
    "assessment_notes" VARCHAR(500),
    "next_steps" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "training_progress_pkey" PRIMARY KEY ("progress_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "training_styles_trainer_id_key" ON "training_styles"("trainer_id");

-- CreateIndex
CREATE UNIQUE INDEX "trainer_working_hours_trainer_id_day_of_week_key" ON "trainer_working_hours"("trainer_id", "day_of_week");

-- CreateIndex
CREATE UNIQUE INDEX "training_progress_trainer_id_pet_id_skill_name_key" ON "training_progress"("trainer_id", "pet_id", "skill_name");

-- AddForeignKey
ALTER TABLE "training_styles" ADD CONSTRAINT "training_styles_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "trainers"("trainer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainer_working_hours" ADD CONSTRAINT "trainer_working_hours_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "trainers"("trainer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_sessions" ADD CONSTRAINT "training_sessions_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "trainers"("trainer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_sessions" ADD CONSTRAINT "training_sessions_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pets"("pet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_progress" ADD CONSTRAINT "training_progress_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "trainers"("trainer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_progress" ADD CONSTRAINT "training_progress_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pets"("pet_id") ON DELETE RESTRICT ON UPDATE CASCADE;
