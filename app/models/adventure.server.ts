import type { User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Note } from "@prisma/client";

export function getAdventureListItems({ userId }: { userId: User["id"] }) {
  return prisma.adventure.findMany({
    where: { users: { some: { id: userId } } },
    select: {
      id: true,
      adventureTemplate: { select: { title: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}
