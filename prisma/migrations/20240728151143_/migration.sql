/*
  Warnings:

  - You are about to drop the column `upVotes` on the `feedback` table. All the data in the column will be lost.
  - Added the required column `feedbackId` to the `UpVote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `feedback` DROP COLUMN `upVotes`;

-- AlterTable
ALTER TABLE `upvote` ADD COLUMN `feedbackId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `UpVote` ADD CONSTRAINT `UpVote_feedbackId_fkey` FOREIGN KEY (`feedbackId`) REFERENCES `Feedback`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
