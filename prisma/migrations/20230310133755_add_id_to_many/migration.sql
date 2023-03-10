/*
  Warnings:

  - The primary key for the `ChallengeTemplatesOnAdventureTemplates` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `ChallengeTemplatesOnAdventureTemplates` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ChallengeTemplatesOnAdventureTemplates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "adventureTemplateId" TEXT NOT NULL,
    "challengeTemplateId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChallengeTemplatesOnAdventureTemplates_adventureTemplateId_fkey" FOREIGN KEY ("adventureTemplateId") REFERENCES "AdventureTemplate" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ChallengeTemplatesOnAdventureTemplates_challengeTemplateId_fkey" FOREIGN KEY ("challengeTemplateId") REFERENCES "ChallengeTemplate" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ChallengeTemplatesOnAdventureTemplates" ("adventureTemplateId", "assignedAt", "challengeTemplateId", "position") SELECT "adventureTemplateId", "assignedAt", "challengeTemplateId", "position" FROM "ChallengeTemplatesOnAdventureTemplates";
DROP TABLE "ChallengeTemplatesOnAdventureTemplates";
ALTER TABLE "new_ChallengeTemplatesOnAdventureTemplates" RENAME TO "ChallengeTemplatesOnAdventureTemplates";
CREATE UNIQUE INDEX "ChallengeTemplatesOnAdventureTemplates_adventureTemplateId_challengeTemplateId_key" ON "ChallengeTemplatesOnAdventureTemplates"("adventureTemplateId", "challengeTemplateId");
CREATE UNIQUE INDEX "ChallengeTemplatesOnAdventureTemplates_adventureTemplateId_position_key" ON "ChallengeTemplatesOnAdventureTemplates"("adventureTemplateId", "position");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
