-- AlterTable
ALTER TABLE "User" ADD COLUMN     "background" TEXT NOT NULL DEFAULT 'https://w.wallhaven.cc/full/28/wallhaven-288vgg.jpg',
ADD COLUMN     "usebackground" BOOLEAN NOT NULL DEFAULT true;
