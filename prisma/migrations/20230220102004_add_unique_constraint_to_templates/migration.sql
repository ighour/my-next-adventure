/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `AdventureTemplate` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[adventureTemplateId,position]` on the table `ChallengeTemplate` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[adventureTemplateId,title]` on the table `ChallengeTemplate` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AdventureTemplate_title_key" ON "AdventureTemplate"("title");

-- CreateIndex
CREATE UNIQUE INDEX "ChallengeTemplate_adventureTemplateId_position_key" ON "ChallengeTemplate"("adventureTemplateId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "ChallengeTemplate_adventureTemplateId_title_key" ON "ChallengeTemplate"("adventureTemplateId", "title");
