/*
  Warnings:

  - Added the required column `color` to the `habits` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Weekdays" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- AlterTable
ALTER TABLE "habits" ADD COLUMN     "color" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "repetitions" (
    "id" TEXT NOT NULL,
    "weekday" "Weekdays" NOT NULL,
    "habit_id" TEXT NOT NULL,

    CONSTRAINT "repetitions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "repetitions" ADD CONSTRAINT "repetitions_habit_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "habits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
