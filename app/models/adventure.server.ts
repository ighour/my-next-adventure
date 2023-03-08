import type { Adventure, AdventureTemplate, User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Adventure } from "@prisma/client";

export function getCreatedAdventureListItems({ userId }: { userId: User["id"] }) {
  return prisma.adventure.findMany({
    where: { creatorId: userId },
    select: {
      id: true,
      title: true,
    },
    orderBy: { updatedAt: "desc" },
  });
}

export function getJoinedAdventureListItems({ userId }: { userId: User["id"] }) {
  return prisma.adventure.findMany({
    where: { joiners: { some: { id: userId } } },
    select: {
      id: true,
      title: true,
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
  const adventureAndChallengesTemplate = await prisma.adventureTemplate.findFirstOrThrow({
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

  return prisma.adventure.create({
    data: {
      title: adventureAndChallengesTemplate.title,
      description: adventureAndChallengesTemplate.description,
      coverImage: adventureAndChallengesTemplate.coverImage,
      maxJoiners: adventureAndChallengesTemplate.maxJoiners,
      adventureTemplateId,
      creatorId: userId,
      challenges: {
        create: adventureAndChallengesTemplate.challengeTemplates.map(template => ({
          challengeTemplateId: template.challengeTemplate.id,
          position: template.position,
          revealed: false,
          completed: false,
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
      title: true,
      description: true,
      maxJoiners: true,
      coverImage: true,
      inviteId: true,
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
      maxJoiners: true,
      joiners: {
        select: {
          id: true
        }
      },
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