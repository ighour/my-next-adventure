/*
  Warnings:

  - The required column `code` was added to the `UserInvite` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserInvite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "validUntil" DATETIME NOT NULL,
    "usedAt" DATETIME,
    "usedById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserInvite_usedById_fkey" FOREIGN KEY ("usedById") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserInvite" ("createdAt", "id", "updatedAt", "usedAt", "usedById", "validUntil") SELECT "createdAt", "id", "updatedAt", "usedAt", "usedById", "validUntil" FROM "UserInvite";
DROP TABLE "UserInvite";
ALTER TABLE "new_UserInvite" RENAME TO "UserInvite";
CREATE UNIQUE INDEX "UserInvite_code_key" ON "UserInvite"("code");
CREATE UNIQUE INDEX "UserInvite_usedById_key" ON "UserInvite"("usedById");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
