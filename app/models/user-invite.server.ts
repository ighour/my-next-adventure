import type { User, UserInvite } from "@prisma/client";
import dayjs from "dayjs";

import { prisma } from "~/db.server";
import { generateRandomAlphanumeric } from "~/utils";
import { EUserInviteType } from "./enums";

export type { UserInvite } from "@prisma/client";

export async function getValidUserInvite({
  inviteCode,
}: {
  inviteCode: UserInvite["id"];
}) {
  const userInvite = await prisma.userInvite.findFirst({
    where: {
      code: inviteCode,
    },
    select: {
      id: true,
      expireAt: true,
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
  if (userInvite.expireAt && dayjs(userInvite.expireAt).isBefore(dayjs())) {
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

export function deactivateUserInvite({
  inviteCode,
  userId,
}: {
  inviteCode: UserInvite["id"];
  userId: User["id"];
}) {
  return prisma.userInvite.update({
    where: {
      code: inviteCode,
    },
    data: {
      usedAt: new Date(),
      usedBy: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export async function createUserInvite({
  type,
  expireAt,
}: {
  type: EUserInviteType;
  expireAt?: UserInvite["expireAt"];
}): Promise<UserInvite> {
  const inviteCode = generateRandomAlphanumeric(8).toUpperCase();

  const inviteCodeCount = await prisma.userInvite.count({
    where: {
      code: inviteCode,
    }
  });

  // Make it unique
  if (inviteCodeCount > 0) {
    return await createUserInvite({ type, expireAt });
  }

  return prisma.userInvite.create({
    data: {
      code: inviteCode,
      type,
      expireAt,
    },
  });
}
