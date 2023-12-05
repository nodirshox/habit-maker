/*
  Warnings:

  - You are about to drop the column `weekday` on the `repetitions` table. All the data in the column will be lost.
  - Added the required column `notify_time` to the `repetitions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number_of_days` to the `repetitions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `show_notification` to the `repetitions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weekdays` to the `repetitions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "repetitions" DROP COLUMN "weekday",
ADD COLUMN     "notify_time" TEXT NOT NULL,
ADD COLUMN     "number_of_days" INTEGER NOT NULL,
ADD COLUMN     "show_notification" BOOLEAN NOT NULL,
ADD COLUMN     "weekdays" JSONB NOT NULL;

-- DropEnum
DROP TYPE "Weekdays";
