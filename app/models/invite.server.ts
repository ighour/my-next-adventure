import type { User, Invite } from "@prisma/client";
import dayjs from "dayjs";

import { prisma } from "~/db.server";
import { generateRandomAlphanumeric } from "~/utils";
import type { EInviteType } from "./enums";

export type { Invite } from "@prisma/client";

export async function getValidInvite({
  code,
}: {
  code: Invite["code"];
}) {
  const invite = await prisma.invite.findFirst({
    where: {
      code,
    },
    select: {
      id: true,
      expireAt: true,
      usedAt: true,
    },
  });

  if (!invite) {
    return {
      invite: null,
      error: null,
    };
  }
  if (invite.usedAt) {
    return {
      invite: null,
      error: "Invite code was already used before",
    };
  }
  if (invite.expireAt && dayjs(invite.expireAt).isBefore(dayjs())) {
    return {
      invite: null,
      error: "Invite code is not valid anymore",
    };
  }

  return {
    invite,
    error: null,
  };
}

export function deactivateInvite({
  code,
  userId,
}: {
  code: Invite["code"];
  userId: User["id"];
}) {
  return prisma.invite.update({
    where: {
      code,
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

export async function createInvite({
  type,
  expireAt,
}: {
  type: EInviteType;
  expireAt?: Invite["expireAt"];
}): Promise<Invite> {
  const code = generateRandomAlphanumeric(8).toUpperCase();

  const codeCount = await prisma.invite.count({
    where: {
      code,
    }
  });

  // Make it unique
  if (codeCount > 0) {
    return await createInvite({ type, expireAt });
  }

  return prisma.invite.create({
    data: {
      code: code,
      type,
      expireAt,
    },
  });
}
