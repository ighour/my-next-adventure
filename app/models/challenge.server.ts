import type { Adventure, Challenge, User } from "@prisma/client";
import dayjs from "dayjs";

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
    include: {
      challengeTemplate: {
        include: {
          hints: {
            include: {
              hint: true
            }
          }
        }
      }
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
    where: {
      id,
      adventure: {
        OR: [{ creatorId: userId }, { joiners: { some: { id: userId } } }],
      },
    },
    include: {
      challengeTemplate: true,
    }
  });
}

export async function revealChallenge({
  id,
  userId,
}: Pick<Challenge, "id"> & {
  userId: User["id"];
}) {
  const challenge = await prisma.challenge.findFirstOrThrow({
    where: {
      id,
      adventure: {
        OR: [{ creatorId: userId }, { joiners: { some: { id: userId } } }],
      },
      canBeRevealedAt: {
        lte: dayjs().toISOString()
      }
    },
    include: {
      adventure: true,
    }
  })

  const now = dayjs();

  await prisma.challenge.update({
    data: {
      revealedAt: now.toISOString(),
    },
    where: {
      id: challenge.id,
    },
  });

  await prisma.challenge.updateMany({
    data: {
      canBeRevealedAt: now.add(challenge.adventure.nextChallengeRevealHours, "hours").toISOString(),
    },
    where: {
      adventureId: challenge.adventure.id,
      position: challenge.position + 1
    },
  })
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
