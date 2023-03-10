import type { Adventure, AdventureTemplate, User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Adventure } from "@prisma/client";

export function getCreatedAdventureListItems({
  userId,
}: {
  userId: User["id"];
}) {
  return prisma.adventure.findMany({
    where: { creatorId: userId },
    select: {
      id: true,
      title: true,
      coverImage: true,
      createdAt: true,
      challenges: {
        select: {
          revealedAt: true,
          completedAt: true,
        }
      },
      creator: {
        select: {
          email: true,
        }
      },
      joiners: {
        select: {
          email: true,
        }
      }
    },
    orderBy: { updatedAt: "desc" },
  });
}

export function getJoinedAdventureListItems({
  userId,
}: {
  userId: User["id"];
}) {
  return prisma.adventure.findMany({
    where: { joiners: { some: { id: userId } } },
    select: {
      id: true,
      title: true,
      coverImage: true,
      createdAt: true,
      challenges: {
        select: {
          revealedAt: true,
          completedAt: true,
        }
      },
      creator: {
        select: {
          email: true,
        }
      },
      joiners: {
        select: {
          email: true,
        }
      }
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function createAdventureFromTemplate({
  adventureTemplateId,
  userId,
}: {
  adventureTemplateId: AdventureTemplate["id"];
  userId: User["id"];
}) {
  const adventureAndChallengesTemplate =
    await prisma.adventureTemplate.findFirstOrThrow({
      where: {
        id: adventureTemplateId,
      },
      include: {
        challengeTemplates: {
          orderBy: {
            position: "asc",
          },
          select: {
            position: true,
            challengeTemplate: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

  return prisma.adventure.create({
    data: {
      title: adventureAndChallengesTemplate.title,
      description: adventureAndChallengesTemplate.description,
      coverImage: adventureAndChallengesTemplate.coverImage,
      maxJoiners: adventureAndChallengesTemplate.maxJoiners,
      nextChallengeRevealHours: adventureAndChallengesTemplate.nextChallengeRevealHours,
      adventureTemplateId,
      creatorId: userId,
      challenges: {
        create: adventureAndChallengesTemplate.challengeTemplates.map(
          (template) => ({
            challengeTemplateId: template.challengeTemplate.id,
            position: template.position,
          })
        ),
      },
    },
  });
}

export function getAdventure({
  id,
  userId,
}: Pick<Adventure, "id"> & {
  userId: User["id"];
}) {
  return prisma.adventure.findFirst({
    select: {
      id: true,
      title: true,
      description: true,
      maxJoiners: true,
      coverImage: true,
      inviteId: true,
      creator: { select: { id: true, email: true } },
      joiners: { select: { email: true } },
    },
    where: {
      id,
      OR: [{ creatorId: userId }, { joiners: { some: { id: userId } } }],
    },
  });
}

function getAdventureByInviteId({
  inviteId,
}: {
  inviteId: Adventure["inviteId"];
}) {
  return prisma.adventure.findFirst({
    where: { inviteId },
    select: {
      id: true,
      creatorId: true,
      maxJoiners: true,
      joiners: {
        select: {
          id: true,
        },
      },
    },
  });
}

export async function getJoinableAdventureByInviteId({
  inviteId,
  userId,
}: {
  inviteId: Adventure["inviteId"];
  userId?: User["id"];
}) {
  const adventure = await getAdventureByInviteId({ inviteId });

  if (!adventure) {
    return {
      adventure: null,
      error: null,
    };
  }

  const joinersIds = adventure.joiners.map((joiner) => joiner.id);

  if (userId && (adventure.creatorId === userId || joinersIds.includes(userId))) {
    return {
      adventure: null,
      error: "You already belongs to that adventure",
    };
  }

  if (adventure.maxJoiners && joinersIds.length >= adventure.maxJoiners) {
    return {
      adventure: null,
      error: "This adventure is full",
    };
  }

  return {
    adventure,
    error: null,
  };
}

export async function joinAdventure({
  id,
  userId,
}: {
  id: Adventure["id"];
  userId: User["id"];
}) {
  return prisma.adventure.update({
    where: {
      id,
    },
    data: {
      joiners: {
        connect: {
          id: userId,
        },
      },
    },
  });
}
