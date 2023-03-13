import type { Adventure, AdventureTemplate, Invite, User } from "@prisma/client";
import dayjs from "dayjs";

import { prisma } from "~/db.server";

export type { Adventure } from "@prisma/client";

export function getCreatedAdventureListItems({
  userId,
}: {
  userId: User["id"];
}) {
  return prisma.adventure.findMany({
    where: { creatorId: userId },
    include: {
      challenges: true,
      creator: true,
      joiners: true,
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
    include: {
      challenges: true,
      creator: true,
      joiners: true,
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
          include: {
            challengeTemplate: true,
          }
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
    where: {
      id,
      OR: [{ creatorId: userId }, { joiners: { some: { id: userId } } }],
    },
    include: {
      creator: true,
      joiners: true,
    }
  });
}

function getValidAdventureByInviteCode({
  code,
}: {
  code: Invite["code"];
}) {
  return prisma.adventure.findFirst({
    where: {
      invites: {
        some: {
          code,
        },
      },
    },
    include: {
      joiners: true,
      invites: {
        where: {
          code,
        }
      }
    },
  });
}

export async function getJoinableAdventureByInviteCode({
  code,
  userId,
}: {
  code: Invite["code"];
  userId?: User["id"];
}) {
  const adventure = await getValidAdventureByInviteCode({ code });

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

  const [invite] = adventure.invites;

  if (invite.expireAt && dayjs().isAfter(invite.expireAt)) {
    return {
      adventure: null,
      error: "This invite code has expired",
    };
  }

  if (invite.remainingUses !== null && invite.remainingUses <= 0) {
    return {
      adventure: null,
      error: "This invite can't be used anymore",
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
