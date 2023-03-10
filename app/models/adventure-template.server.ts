import { prisma } from "~/db.server";

export type { AdventureTemplate } from "@prisma/client";

export function getAdventureTemplateListItems() {
  return prisma.adventureTemplate.findMany({
    select: {
      id: true,
      title: true,
      coverImage: true,
      description: true,
      maxJoiners: true,
    },
    orderBy: { updatedAt: "desc" },
  });
}
