/*
  Warnings:

  - You are about to drop the column `name` on the `Exercise` table. All the data in the column will be lost.
  - You are about to alter the column `bodyPart` on the `Exercise` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `targetMuscle` on the `Exercise` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.

*/
-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('beginner', 'intermediate', 'advanced');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('strength', 'cardio', 'mobility', 'balance', 'stretching', 'plyometrics', 'rehabilitation', 'other');

-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "name",
ADD COLUMN     "category" "Category",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "difficulty" "Difficulty",
ADD COLUMN     "images" JSONB,
ADD COLUMN     "instructions" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "secondaryMuscles" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "thumbnailUrl" TEXT,
ALTER COLUMN "bodyPart" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "targetMuscle" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "Routine" ADD COLUMN     "category" "Category",
ADD COLUMN     "difficulty" "Difficulty",
ADD COLUMN     "thumbnailUrl" TEXT;

-- CreateIndex
CREATE INDEX "Exercise_bodyPart_idx" ON "Exercise"("bodyPart");

-- CreateIndex
CREATE INDEX "Exercise_targetMuscle_idx" ON "Exercise"("targetMuscle");
