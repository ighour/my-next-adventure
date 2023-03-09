/*
  Warnings:

  - Added the required column `nextChallengeRevealHours` to the `AdventureTemplate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nextChallengeRevealHours` to the `Adventure` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AdventureTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "coverImage" TEXT,
    "maxJoiners" INTEGER NOT NULL,
    "nextChallengeRevealHours" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_AdventureTemplate" ("coverImage", "createdAt", "description", "id", "maxJoiners", "title", "updatedAt") SELECT "coverImage", "createdAt", "description", "id", "maxJoiners", "title", "updatedAt" FROM "AdventureTemplate";
DROP TABLE "AdventureTemplate";
ALTER TABLE "new_AdventureTemplate" RENAME TO "AdventureTemplate";
CREATE UNIQUE INDEX "AdventureTemplate_title_key" ON "AdventureTemplate"("title");
CREATE TABLE "new_Adventure" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "coverImage" TEXT,
    "maxJoiners" INTEGER NOT NULL,
    "nextChallengeRevealHours" INTEGER NOT NULL,
    "inviteId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "creatorId" TEXT NOT NULL,
    "adventureTemplateId" TEXT NOT NULL,
    CONSTRAINT "Adventure_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Adventure_adventureTemplateId_fkey" FOREIGN KEY ("adventureTemplateId") REFERENCES "AdventureTemplate" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Adventure" ("adventureTemplateId", "coverImage", "createdAt", "creatorId", "description", "id", "inviteId", "maxJoiners", "title", "updatedAt") SELECT "adventureTemplateId", "coverImage", "createdAt", "creatorId", "description", "id", "inviteId", "maxJoiners", "title", "updatedAt" FROM "Adventure";
DROP TABLE "Adventure";
ALTER TABLE "new_Adventure" RENAME TO "Adventure";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
