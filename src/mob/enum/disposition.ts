import { MobEntity } from "../entity/mobEntity"

export enum Disposition {
  Standing = "standing",
  Sitting = "sitting",
  Sleeping = "sleeping",
  Dead = "dead",
  Any = "any",
}

export function onlyLiving(mob: MobEntity): boolean {
  return mob.disposition !== Disposition.Dead
}

export const allDispositions = [
  Disposition.Standing,
  Disposition.Sitting,
  Disposition.Sleeping,
  Disposition.Dead,
]
