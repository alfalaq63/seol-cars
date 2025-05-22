-- AlterTable
ALTER TABLE `company` ADD COLUMN `latitude` DOUBLE NULL,
    ADD COLUMN `longitude` DOUBLE NULL,
    MODIFY `logoUrl` VARCHAR(191) NULL;
