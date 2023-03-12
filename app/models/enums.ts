export type { ChallengeTemplate } from "@prisma/client";

export enum ETimeOfDay {
  ANY = "ANY",
  MORNING = "MORNING",
  AFTERNOON = "AFTERNOON",
  EVENING = "EVENING",
  NIGHT = "NIGHT"
}

export enum EHint {
  HOME = "HOME",
  SHOPPING_CART = "SHOPPING_CART",
}

export enum EUserInviteType {
  PLATFORM = "PLATFORM",
  ADVENTURE = "ADVENTURE",
}
