/*
  Warnings:

  - You are about to drop the column `voteCount` on the `feedback` table. All the data in the column will be lost.
  - You are about to drop the `vote` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `vote` DROP FOREIGN KEY `Vote_feedbackId_fkey`;

-- DropForeignKey
ALTER TABLE `vote` DROP FOREIGN KEY `Vote_userId_fkey`;

-- AlterTable
ALTER TABLE `feedback` DROP COLUMN `voteCount`,
    ADD COLUMN `upVotes` INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE `vote`;
