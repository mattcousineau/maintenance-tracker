/*
  Warnings:

  - Made the column `createdByUserId` on table `chatmessage` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `chatmessage` DROP FOREIGN KEY `ChatMessage_createdByUserId_fkey`;

-- AlterTable
ALTER TABLE `chatmessage` MODIFY `createdByUserId` VARCHAR(255) NOT NULL;

-- AddForeignKey
ALTER TABLE `ChatMessage` ADD CONSTRAINT `ChatMessage_createdByUserId_fkey` FOREIGN KEY (`createdByUserId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
