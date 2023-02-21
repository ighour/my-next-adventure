import type { Adventure, Challenge, User } from "@prisma/client";

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

export function getChallenge({
  id,
  userId,
}: Pick<Challenge, "id"> & {
  userId: User["id"];
}) {
  return prisma.challenge.findFirst({
    select: {
      id: true,
      revealed: true,
      completed: true,
      note: true,
      challengeTemplate: { select: { title: true, description: true } },
    },
    where: { id, adventure: { users: { some: { id: userId } } } },
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
      revealed: true,
    },
    where: { id, adventure: { users: { some: { id: userId } } } },
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
      completed: true,
    },
    where: { id, adventure: { users: { some: { id: userId } } } },
  });
}

export function updateNote({
  id,
  note,
  userId,
}: Pick<Challenge, "id"> & {
  userId: User["id"];
  note: string;
}) {
  return prisma.challenge.updateMany({
    data: {
      note,
    },
    where: { id, adventure: { users: { some: { id: userId } } } },
  });
}