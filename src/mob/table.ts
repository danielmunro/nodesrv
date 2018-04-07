import { Mob } from "./model/mob"

let mobs = []

export function addMob(mob: Mob): Mob {
  mobs.push(mob)

  return mob
}

export function getMobs(): Mob[] {
  return mobs
}

export function reset(): void {
  mobs = []
}
