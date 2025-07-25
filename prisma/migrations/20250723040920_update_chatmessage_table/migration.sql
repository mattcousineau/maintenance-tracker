/*
  Warnings:

  - The primary key for the `chatmessage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `chatmessage` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `chatmessage` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `chatmessage` DROP FOREIGN KEY `ChatMessage_userId_fkey`;

-- DropIndex
DROP INDEX `ChatMessage_userId_key` ON `chatmessage`;

-- AlterTable
ALTER TABLE `chatmessage` DROP PRIMARY KEY,
    DROP COLUMN `userId`,
    ADD COLUMN `createdByUserId` VARCHAR(255) NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `ChatMessage` ADD CONSTRAINT `ChatMessage_createdByUserId_fkey` FOREIGN KEY (`createdByUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
