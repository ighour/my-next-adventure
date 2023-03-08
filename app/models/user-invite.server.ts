import type { User, UserInvite } from "@prisma/client";
import dayjs from "dayjs";

import { prisma } from "~/db.server";

export type { UserInvite } from "@prisma/client";

function getUserInvite({ inviteCode }: { inviteCode: UserInvite["id"] }) {
  return prisma.userInvite.findFirst({
    where: { 
      code: inviteCode,
    },
    select: {
      id: true,
      validUntil: true,
      usedAt: true,
    },
  });
}

export async function getValidUserInvite({ inviteCode }: { inviteCode: UserInvite["id"] }) {
  const userInvite = await prisma.userInvite.findFirst({
    where: { 
      code: inviteCode,
    },
    select: {
      id: true,
      validUntil: true,
      usedAt: true,
    },
  });

  if (!userInvite) {
    return {
      userInvite: null,
      error: null,
    };
  }
  if (userInvite.usedAt) {
    return {
      userInvite: null,
      error: "Invite code was already used before",
    };
  }
  if (dayjs(userInvite.validUntil).isBefore(dayjs())) {
    return {
      userInvite: null,
      error: "Invite code is not valid anymore",
    };
  }

  return {
    userInvite,
    error: null,
  };
}

export function deactivateUserInvite({ inviteCode, userId }: { inviteCode: UserInvite["id"]; userId: User["id"] }) {
  return prisma.userInvite.update({
    where: { 
      code: inviteCode,
    },
    data: {
      usedAt: new Date(),
      usedBy: {
        connect: {
          id: userId
        }
      }
    }
  });
}