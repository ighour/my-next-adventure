import { prisma } from "~/db.server";

export type { AdventureTemplate } from "@prisma/client";

export function getAdventureTemplateListItems() {
  return prisma.adventureTemplate.findMany({
    select: {
      id: true,
      title: true,
    },
    orderBy: { updatedAt: "desc" },
  });
}
