/*
  Warnings:

  - Added the required column `durationMinutes` to the `ChallengeTemplate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeOfDay` to the `ChallengeTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Hint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "HintsOnChallengeTemplates" (
    "challengeTemplateId" TEXT NOT NULL,
    "hintId" TEXT NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("challengeTemplateId", "hintId"),
    CONSTRAINT "HintsOnChallengeTemplates_challengeTemplateId_fkey" FOREIGN KEY ("challengeTemplateId") REFERENCES "ChallengeTemplate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "HintsOnChallengeTemplates_hintId_fkey" FOREIGN KEY ("hintId") REFERENCES "Hint" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ChallengeTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "notePlaceholder" TEXT,
    "position" INTEGER NOT NULL,
    "costEuros" DECIMAL NOT NULL DEFAULT 0,
    "timeOfDay" TEXT NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "adventureTemplateId" TEXT NOT NULL,
    CONSTRAINT "ChallengeTemplate_adventureTemplateId_fkey" FOREIGN KEY ("adventureTemplateId") REFERENCES "AdventureTemplate" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ChallengeTemplate" ("adventureTemplateId", "createdAt", "description", "id", "notePlaceholder", "position", "title", "updatedAt") SELECT "adventureTemplateId", "createdAt", "description", "id", "notePlaceholder", "position", "title", "updatedAt" FROM "ChallengeTemplate";
DROP TABLE "ChallengeTemplate";
ALTER TABLE "new_ChallengeTemplate" RENAME TO "ChallengeTemplate";
CREATE UNIQUE INDEX "ChallengeTemplate_adventureTemplateId_position_key" ON "ChallengeTemplate"("adventureTemplateId", "position");
CREATE UNIQUE INDEX "ChallengeTemplate_adventureTemplateId_title_key" ON "ChallengeTemplate"("adventureTemplateId", "title");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
