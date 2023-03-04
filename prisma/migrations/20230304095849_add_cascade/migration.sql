-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_HintsOnChallengeTemplates" (
    "challengeTemplateId" TEXT NOT NULL,
    "hintId" TEXT NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("challengeTemplateId", "hintId"),
    CONSTRAINT "HintsOnChallengeTemplates_challengeTemplateId_fkey" FOREIGN KEY ("challengeTemplateId") REFERENCES "ChallengeTemplate" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "HintsOnChallengeTemplates_hintId_fkey" FOREIGN KEY ("hintId") REFERENCES "Hint" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_HintsOnChallengeTemplates" ("assignedAt", "challengeTemplateId", "hintId") SELECT "assignedAt", "challengeTemplateId", "hintId" FROM "HintsOnChallengeTemplates";
DROP TABLE "HintsOnChallengeTemplates";
ALTER TABLE "new_HintsOnChallengeTemplates" RENAME TO "HintsOnChallengeTemplates";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
