-- DropForeignKey
ALTER TABLE `chatmessage` DROP FOREIGN KEY `ChatMessage_createdByUserId_fkey`;

-- AddForeignKey
ALTER TABLE `ChatMessage` ADD CONSTRAINT `ChatMessage_createdByUserId_fkey` FOREIGN KEY (`createdByUserId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `chatmessage` RENAME INDEX `ChatMessage_createdByUserId_fkey` TO `ChatMessage_createdByUserId_idx`;
