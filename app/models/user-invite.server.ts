import type { User, UserInvite } from "@prisma/client";

import { prisma } from "~/db.server";

export type { UserInvite } from "@prisma/client";

export function getUserInvite({ inviteCode }: { inviteCode: UserInvite["id"] }) {
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