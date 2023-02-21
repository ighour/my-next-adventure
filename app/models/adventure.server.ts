import type { Adventure, AdventureTemplate, User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Adventure } from "@prisma/client";

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

export async function createAdventure({
  adventureTemplateId,
  userId,
  otherUsersEmail,
}: {
  adventureTemplateId: AdventureTemplate["id"];
  userId: User["id"];
  otherUsersEmail: User["email"][];
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
      users: {
        connect: [
          { id: userId },
          ...otherUsersEmail.map(email => ({ email }))
        ]
      },
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
      adventureTemplate: { select: { title: true, description: true } },
      users: { select: { email: true }}
    },
    where: { id, users: { some: { id: userId } } },
  });
}

export function deleteAdventure({
  id,
  userId,
}: Pick<Adventure, "id"> & { userId: User["id"] }) {
  return prisma.adventure.deleteMany({
    where: { id, users: { some: { id: userId } } },
  });
}