/*
  Warnings:

  - Added the required column `description` to the `Adventure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxJoiners` to the `Adventure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Adventure` table without a default value. This is not possible if the table is not empty.
  - Made the column `maxJoiners` on table `AdventureTemplate` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Adventure" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "coverImage" TEXT,
    "maxJoiners" INTEGER NOT NULL,
    "inviteId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "creatorId" TEXT NOT NULL,
    "adventureTemplateId" TEXT NOT NULL,
    CONSTRAINT "Adventure_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Adventure_adventureTemplateId_fkey" FOREIGN KEY ("adventureTemplateId") REFERENCES "AdventureTemplate" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Adventure" ("adventureTemplateId", "createdAt", "creatorId", "id", "inviteId", "updatedAt") SELECT "adventureTemplateId", "createdAt", "creatorId", "id", "inviteId", "updatedAt" FROM "Adventure";
DROP TABLE "Adventure";
ALTER TABLE "new_Adventure" RENAME TO "Adventure";
CREATE TABLE "new_AdventureTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "coverImage" TEXT,
    "maxJoiners" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_AdventureTemplate" ("coverImage", "createdAt", "description", "id", "maxJoiners", "title", "updatedAt") SELECT "coverImage", "createdAt", "description", "id", "maxJoiners", "title", "updatedAt" FROM "AdventureTemplate";
DROP TABLE "AdventureTemplate";
ALTER TABLE "new_AdventureTemplate" RENAME TO "AdventureTemplate";
CREATE UNIQUE INDEX "AdventureTemplate_title_key" ON "AdventureTemplate"("title");
CREATE TABLE "new_Challenge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "revealed" BOOLEAN NOT NULL,
    "completed" BOOLEAN NOT NULL,
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
INSERT INTO "new_Challenge" ("adventureId", "challengeTemplateId", "completed", "completedImage", "createdAt", "id", "note", "position", "revealed", "updatedAt") SELECT "adventureId", "challengeTemplateId", "completed", "completedImage", "createdAt", "id", "note", "position", "revealed", "updatedAt" FROM "Challenge";
DROP TABLE "Challenge";
ALTER TABLE "new_Challenge" RENAME TO "Challenge";
CREATE TABLE "new_ChallengeTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "notePlaceholder" TEXT,
    "costEuros" DECIMAL NOT NULL,
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
