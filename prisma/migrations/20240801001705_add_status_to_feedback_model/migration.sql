/*
  Warnings:

  - Added the required column `status` to the `Feedback` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `feedback` ADD COLUMN `status` ENUM('Planned', 'InProgress', 'Live') NOT NULL;
