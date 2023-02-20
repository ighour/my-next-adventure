/*
  Warnings:

  - You are about to drop the column `userId` on the `ChallengeTemplate` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ChallengeTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "adventureTemplateId" TEXT NOT NULL,
    CONSTRAINT "ChallengeTemplate_adventureTemplateId_fkey" FOREIGN KEY ("adventureTemplateId") REFERENCES "AdventureTemplate" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ChallengeTemplate" ("adventureTemplateId", "createdAt", "description", "id", "title", "updatedAt") SELECT "adventureTemplateId", "createdAt", "description", "id", "title", "updatedAt" FROM "ChallengeTemplate";
DROP TABLE "ChallengeTemplate";
ALTER TABLE "new_ChallengeTemplate" RENAME TO "ChallengeTemplate";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
