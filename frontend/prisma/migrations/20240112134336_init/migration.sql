/*
  Warnings:

  - You are about to drop the column `background` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `usebackground` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "background",
DROP COLUMN "usebackground";

-- DropTable
DROP TABLE "Message";
