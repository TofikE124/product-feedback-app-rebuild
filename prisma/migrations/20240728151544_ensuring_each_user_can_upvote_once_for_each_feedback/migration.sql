/*
  Warnings:

  - A unique constraint covering the columns `[userId,feedbackId]` on the table `UpVote` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `UpVote_userId_feedbackId_key` ON `UpVote`(`userId`, `feedbackId`);
