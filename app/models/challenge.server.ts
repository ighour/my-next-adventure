import type { Adventure, User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Challenge } from "@prisma/client";

export function getChallengeListItems({ userId, adventureId }: { userId: User["id"], adventureId: Adventure["id"] }) {
  return prisma.challenge.findMany({
    where: { 
      adventureId,
      adventure: {
        users: { some: { id: userId } } },
    },
    select: {
      id: true,
      revealed: true,
      completed: true,
      challengeTemplate: { select: { title: true, position: true } },
    },
    orderBy: { challengeTemplate: { position: "asc" } },
  });
}