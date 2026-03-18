/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `medicine` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "category" ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "medicine" DROP COLUMN "imageUrl",
ADD COLUMN     "images" TEXT[];
