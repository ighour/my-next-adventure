import type { Adventure, Challenge, User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Challenge } from "@prisma/client";

function getBaseChallengeListItemsQuery({
  userId,
  adventureId,
}: {
  userId: User["id"];
  adventureId: Adventure["id"];
}) {
  return {
    where: {
      adventureId,
      adventure: {
        OR: [{ creatorId: userId }, { joiners: { some: { id: userId } } }],
      },
    },
    select: {
      id: true,
      revealedAt: true,
      completedAt: true,
      note: true,
      completedImage: true,
      position: true,
      challengeTemplate: {
        select: {
          title: true,
          description: true,
          notePlaceholder: true,
          costEuros: true,
          timeOfDay: true,
          durationMinutes: true,
          hints: {
            select: {
              hint: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  };
}

export function getRevealedChallengeListItems({
  userId,
  adventureId,
}: {
  userId: User["id"];
  adventureId: Adventure["id"];
}) {
  const baseQuery = getBaseChallengeListItemsQuery({ userId, adventureId });

  return prisma.challenge.findMany({
    ...baseQuery,
    where: {
      ...baseQuery.where,
      revealedAt: {
        not: null
      }
    },
    orderBy: {
      position: 'asc'
    }
  });
}

export function getNextUnrevealedChallengeListItem({
  userId,
  adventureId,
}: {
  userId: User["id"];
  adventureId: Adventure["id"];
}) {
  const baseQuery = getBaseChallengeListItemsQuery({ userId, adventureId });

  return prisma.challenge.findFirst({
    ...baseQuery,
    where: {
      ...baseQuery.where,
      revealedAt: null
    },
    orderBy: {
      position: 'asc'
    }
  });
}

export function getChallenge({
  id,
  userId,
}: Pick<Challenge, "id"> & {
  userId: User["id"];
}) {
  return prisma.challenge.findFirst({
    select: {
      id: true,
      revealedAt: true,
      completedAt: true,
      note: true,
      challengeTemplate: { select: { title: true, description: true } },
    },
    where: {
      id,
      adventure: {
        OR: [{ creatorId: userId }, { joiners: { some: { id: userId } } }],
      },
    },
  });
}

export function revealChallenge({
  id,
  userId,
}: Pick<Challenge, "id"> & {
  userId: User["id"];
}) {
  return prisma.challenge.updateMany({
    data: {
      revealedAt: new Date(),
    },
    where: {
      id,
      adventure: {
        OR: [{ creatorId: userId }, { joiners: { some: { id: userId } } }],
      },
    },
  });
}

export function completeChallenge({
  id,
  userId,
}: Pick<Challenge, "id"> & {
  userId: User["id"];
}) {
  return prisma.challenge.updateMany({
    data: {
      completedAt: new Date(),
    },
    where: {
      id,
      adventure: {
        OR: [{ creatorId: userId }, { joiners: { some: { id: userId } } }],
      },
    },
  });
}

export function updateNote({
  id,
  note,
  userId,
}: Pick<Challenge, "id"> & {
  userId: User["id"];
  note: string | null;
}) {
  return prisma.challenge.updateMany({
    data: {
      note,
    },
    where: {
      id,
      adventure: {
        OR: [{ creatorId: userId }, { joiners: { some: { id: userId } } }],
      },
    },
  });
}

export function addCompletedImage({
  id,
  completedImage,
  userId,
}: Pick<Challenge, "id"> & {
  userId: User["id"];
  completedImage: string;
}) {
  return prisma.challenge.updateMany({
    data: {
      completedImage,
    },
    where: {
      id,
      adventure: {
        OR: [{ creatorId: userId }, { joiners: { some: { id: userId } } }],
      },
    },
  });
}
