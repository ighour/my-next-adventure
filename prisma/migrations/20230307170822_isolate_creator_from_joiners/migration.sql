/*
  Warnings:

  - You are about to drop the `_AdventureToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `creatorId` to the `Adventure` table without a default value. This is not possible if the table is not empty.
  - The required column `inviteId` was added to the `Adventure` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "_AdventureToUser_B_index";

-- DropIndex
DROP INDEX "_AdventureToUser_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_AdventureToUser";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_Adventure_joinedAdventures" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_Adventure_joinedAdventures_A_fkey" FOREIGN KEY ("A") REFERENCES "Adventure" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Adventure_joinedAdventures_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Adventure" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "inviteId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "adventureTemplateId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    CONSTRAINT "Adventure_adventureTemplateId_fkey" FOREIGN KEY ("adventureTemplateId") REFERENCES "AdventureTemplate" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Adventure_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Adventure" ("adventureTemplateId", "createdAt", "id", "updatedAt") SELECT "adventureTemplateId", "createdAt", "id", "updatedAt" FROM "Adventure";
DROP TABLE "Adventure";
ALTER TABLE "new_Adventure" RENAME TO "Adventure";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_Adventure_joinedAdventures_AB_unique" ON "_Adventure_joinedAdventures"("A", "B");

-- CreateIndex
CREATE INDEX "_Adventure_joinedAdventures_B_index" ON "_Adventure_joinedAdventures"("B");
