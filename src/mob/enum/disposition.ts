import { Mob } from "../model/mob"

export enum Disposition {
  Standing = "standing",
  Sitting = "sitting",
  Sleeping = "sleeping",
  Dead = "dead",
}

export function onlyLiving(mob: Mob): boolean {
  return mob.disposition !== Disposition.Dead
}

export const allDispositions = [
  Disposition.Standing,
  Disposition.Sitting,
  Disposition.Sleeping,
  Disposition.Dead,
]
