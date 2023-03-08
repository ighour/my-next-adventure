/*
  Warnings:

  - You are about to drop the column `position` on the `ChallengeTemplate` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ChallengeTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "notePlaceholder" TEXT,
    "costEuros" DECIMAL NOT NULL DEFAULT 0,
    "timeOfDay" TEXT NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ChallengeTemplate" ("costEuros", "createdAt", "description", "durationMinutes", "id", "notePlaceholder", "timeOfDay", "title", "updatedAt") SELECT "costEuros", "createdAt", "description", "durationMinutes", "id", "notePlaceholder", "timeOfDay", "title", "updatedAt" FROM "ChallengeTemplate";
DROP TABLE "ChallengeTemplate";
ALTER TABLE "new_ChallengeTemplate" RENAME TO "ChallengeTemplate";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
