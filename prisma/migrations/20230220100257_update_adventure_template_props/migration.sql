/*
  Warnings:

  - You are about to drop the column `body` on the `AdventureTemplate` table. All the data in the column will be lost.
  - Added the required column `description` to the `AdventureTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AdventureTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT,
    CONSTRAINT "AdventureTemplate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AdventureTemplate" ("createdAt", "id", "title", "updatedAt", "userId") SELECT "createdAt", "id", "title", "updatedAt", "userId" FROM "AdventureTemplate";
DROP TABLE "AdventureTemplate";
ALTER TABLE "new_AdventureTemplate" RENAME TO "AdventureTemplate";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
