import * as sillyname from "sillyname"
import { newStartingAttributes } from "../../attributes/factory/attributeFactory"
import { newMob } from "../../mob/factory/mobFactory"
import { Mob } from "../../mob/model/mob"
import { RaceType } from "../../mob/race/enum/raceType"

export function getTestMob(name: string = null, level: number = 1): Mob {
  if (name === null) {
    name = sillyname()
  }
  const mob = newMob(
    name,
    "a test fixture",
    RaceType.Human,
    20, 100, 100,
    newStartingAttributes(20, 100, 100, level))
  mob.brief = name
  mob.level = level
  mob.traits.isNpc = true

  return mob
}
