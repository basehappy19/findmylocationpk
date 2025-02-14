/*
  Warnings:

  - You are about to drop the column `maxScore` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `minScore` on the `Location` table. All the data in the column will be lost.
  - Added the required column `description` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topic` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Location` DROP COLUMN `maxScore`,
    DROP COLUMN `minScore`,
    ADD COLUMN `description` VARCHAR(191) NOT NULL,
    ADD COLUMN `topic` VARCHAR(191) NOT NULL;
