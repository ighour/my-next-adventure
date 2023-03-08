/*
  Warnings:

  - You are about to drop the column `completed` on the `Challenge` table. All the data in the column will be lost.
  - You are about to drop the column `revealed` on the `Challenge` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Challenge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "revealedAt" DATETIME,
    "completedAt" DATETIME,
    "note" TEXT,
    "completedImage" TEXT,
    "position" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "adventureId" TEXT NOT NULL,
    "challengeTemplateId" TEXT NOT NULL,
    CONSTRAINT "Challenge_adventureId_fkey" FOREIGN KEY ("adventureId") REFERENCES "Adventure" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Challenge_challengeTemplateId_fkey" FOREIGN KEY ("challengeTemplateId") REFERENCES "ChallengeTemplate" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Challenge" ("adventureId", "challengeTemplateId", "completedImage", "createdAt", "id", "note", "position", "updatedAt") SELECT "adventureId", "challengeTemplateId", "completedImage", "createdAt", "id", "note", "position", "updatedAt" FROM "Challenge";
DROP TABLE "Challenge";
ALTER TABLE "new_Challenge" RENAME TO "Challenge";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
