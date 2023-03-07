/*
  Warnings:

  - You are about to drop the column `userId` on the `AdventureTemplate` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AdventureTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "coverImage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_AdventureTemplate" ("coverImage", "createdAt", "description", "id", "title", "updatedAt") SELECT "coverImage", "createdAt", "description", "id", "title", "updatedAt" FROM "AdventureTemplate";
DROP TABLE "AdventureTemplate";
ALTER TABLE "new_AdventureTemplate" RENAME TO "AdventureTemplate";
CREATE UNIQUE INDEX "AdventureTemplate_title_key" ON "AdventureTemplate"("title");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
