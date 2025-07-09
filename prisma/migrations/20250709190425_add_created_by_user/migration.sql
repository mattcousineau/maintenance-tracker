-- AlterTable
ALTER TABLE `request` ADD COLUMN `createdByUserId` VARCHAR(255) NULL;

-- AddForeignKey
ALTER TABLE `Request` ADD CONSTRAINT `Request_createdByUserId_fkey` FOREIGN KEY (`createdByUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
