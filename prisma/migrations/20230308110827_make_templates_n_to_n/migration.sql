/*
  Warnings:

  - You are about to drop the column `adventureTemplateId` on the `ChallengeTemplate` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "ChallengeTemplatesOnAdventureTemplates" (
    "adventureTemplateId" TEXT NOT NULL,
    "challengeTemplateId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("adventureTemplateId", "challengeTemplateId"),
    CONSTRAINT "ChallengeTemplatesOnAdventureTemplates_adventureTemplateId_fkey" FOREIGN KEY ("adventureTemplateId") REFERENCES "AdventureTemplate" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ChallengeTemplatesOnAdventureTemplates_challengeTemplateId_fkey" FOREIGN KEY ("challengeTemplateId") REFERENCES "ChallengeTemplate" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ChallengeTemplate" ("costEuros", "createdAt", "description", "durationMinutes", "id", "notePlaceholder", "position", "timeOfDay", "title", "updatedAt") SELECT "costEuros", "createdAt", "description", "durationMinutes", "id", "notePlaceholder", "position", "timeOfDay", "title", "updatedAt" FROM "ChallengeTemplate";
DROP TABLE "ChallengeTemplate";
ALTER TABLE "new_ChallengeTemplate" RENAME TO "ChallengeTemplate";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "ChallengeTemplatesOnAdventureTemplates_adventureTemplateId_position_key" ON "ChallengeTemplatesOnAdventureTemplates"("adventureTemplateId", "position");
