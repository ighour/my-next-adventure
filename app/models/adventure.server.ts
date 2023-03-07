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
  const challengeTemplates = await prisma.challengeTemplate.findMany({
    where: {
      adventureTemplateId
    },
    orderBy: { position: "asc" },
  });

  return prisma.adventure.create({
    data: {
      adventureTemplateId,
      creatorId: userId,
      challenges: {
        create: challengeTemplates.map(template => ({
          challengeTemplateId: template.id
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
      adventureTemplate: { select: { title: true, description: true } },
      creator: { select: { email: true }},
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