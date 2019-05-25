import {cloneDeep} from "lodash"
import * as sillyname from "sillyname"
import { newStartingAttributes, newStartingVitals } from "../../attributes/factory/attributeFactory"
import { newMob } from "../../mob/factory/factory"
import { Mob } from "../../mob/model/mob"
import { RaceType } from "../../mob/race/enum/raceType"

export function getTestMob(name: string = null, level: number = 1): Mob {
  if (name === null) {
    name = sillyname()
  }
  const vitals = newStartingVitals()
  const mob = newMob(
    name,
    "a test fixture",
    RaceType.Human,
    vitals,
    newStartingAttributes(cloneDeep(vitals), level))
  mob.brief = name
  mob.level = level
  mob.traits.isNpc = true

  return mob
}
