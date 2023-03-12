import type { Invite } from "@prisma/client";
import dayjs from "dayjs";

import { prisma } from "~/db.server";
import { generateRandomAlphanumeric } from "~/utils";
import type { EInviteType } from "./enums";

export type { Invite } from "@prisma/client";

export async function getValidInvite({ code }: { code: Invite["code"] }) {
  const invite = await prisma.invite.findFirst({
    where: {
      code,
    },
    select: {
      id: true,
      expireAt: true,
      remainingUses: true,
    },
  });

  if (!invite) {
    return {
      invite: null,
      error: null,
    };
  }
  if (invite.remainingUses !== null && invite.remainingUses <= 0) {
    return {
      invite: null,
      error: "No remaining uses for this invite code",
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

export function decrementInvite({ code }: { code: Invite["code"] }) {
  return prisma.invite.update({
    where: {
      code,
    },
    data: {
      remainingUses: {
        decrement: 1,
      },
    },
  });
}

export async function createInvite({
  type,
  remainingUses,
  expireAt,
}: {
  type: EInviteType;
  remainingUses?: Invite["remainingUses"];
  expireAt?: Invite["expireAt"];
}): Promise<Invite> {
  const code = generateRandomAlphanumeric(8).toUpperCase();

  const codeCount = await prisma.invite.count({
    where: {
      code,
    },
  });

  // Make it unique
  if (codeCount > 0) {
    return await createInvite({ type, expireAt });
  }

  return prisma.invite.create({
    data: {
      code: code,
      type,
      remainingUses,
      expireAt,
    },
  });
}
