import type { Adventure, Invite } from "@prisma/client";
import dayjs from "dayjs";

import { prisma } from "~/db.server";
import { generateRandomAlphanumeric } from "~/utils";
import { EInviteType } from "./enums";

export type { Invite } from "@prisma/client";

export async function getValidInviteFromCode({
  code,
}: {
  code: Invite["code"];
}) {
  const invite = await prisma.invite.findFirst({
    where: {
      code,
      type: EInviteType.PLATFORM,
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

export async function getOrCreateValidInviteFromAdventure({
  adventureId,
  maxJoiners,
  currentJoinersCount,
}: {
  adventureId: Adventure["id"];
  maxJoiners: number;
  currentJoinersCount: number;
}) {
  if (currentJoinersCount >= maxJoiners) {
    return null
  }

  const invite = await prisma.invite.findFirst({
    where: {
      type: EInviteType.ADVENTURE,
      adventureId,
      expireAt: {
        gte: dayjs().toISOString(),
      },
      remainingUses: {
        gte: 1,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (invite) {
    return invite;
  }

  return await createInvite({
    type: EInviteType.ADVENTURE,
    remainingUses: maxJoiners - currentJoinersCount,
    expireAt: dayjs().add(1, 'month').toDate(),
    adventureId,
  });
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
  adventureId,
}: {
  type: EInviteType;
  remainingUses?: Invite["remainingUses"];
  expireAt?: Invite["expireAt"];
  adventureId?: Adventure["id"];
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
      adventureId,
    },
  });
}
