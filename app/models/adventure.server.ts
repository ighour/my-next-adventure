import type { Adventure, AdventureTemplate, User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Adventure } from "@prisma/client";

export function getCreatedAdventureListItems({ userId }: { userId: User["id"] }) {
  return prisma.adventure.findMany({
    where: { creatorId: userId },
    select: {
      id: true,
      adventureTemplate: { select: { title: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export function getJoinedAdventureListItems({ userId }: { userId: User["id"] }) {
  return prisma.adventure.findMany({
    where: { joiners: { some: { id: userId } } },
    select: {
      id: true,
      adventureTemplate: { select: { title: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function createAdventure({
  adventureTemplateId,
  userId,
}: {
  adventureTemplateId: AdventureTemplate["id"];
  userId: User["id"];
}) {
  const adventureAndChallengesTemplate = await prisma.adventureTemplate.findFirst({
    where: {
      id: adventureTemplateId
    },
    include: {
      challengeTemplates: {
        orderBy: {
          position: 'asc',
        },
        select: {
          position: true,
          challengeTemplate: {
            select: {
              id: true
            }
          }
        }
      }
    }
  });

  const challengeTemplates = adventureAndChallengesTemplate?.challengeTemplates ?? [];

  return prisma.adventure.create({
    data: {
      adventureTemplateId,
      creatorId: userId,
      challenges: {
        create: challengeTemplates.map(template => ({
          challengeTemplateId: template.challengeTemplate.id,
          position: template.position,
        }))
      }
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
      inviteId: true,
      adventureTemplate: { select: { title: true, description: true, maxJoiners: true, coverImage: true } },
      creator: { select: { id: true, email: true }},
      joiners: { select: { email: true }}
    },
    where: {
      id,
      OR: [
        { creatorId: userId },
        { joiners: { some: { id: userId } } }
      ]
    },
  });
}

export function getAdventureByInviteId({ inviteId }: { inviteId: Adventure["inviteId"] }) {
  return prisma.adventure.findFirst({
    where: { inviteId },
    select: {
      id: true,
      creatorId: true,
      joiners: {
        select: {
          id: true
        }
      },
      adventureTemplate: {
        select: {
          maxJoiners: true
        }
      }
    },
  });
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
      id
    },
    data: {
      joiners: {
        connect: {
          id: userId
        }
      }
    }
  });
}