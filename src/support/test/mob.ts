// @ts-ignore
import * as sillyname from "sillyname"
import { newStartingAttributes } from "../../attributes/factory/attributeFactory"
import { MobEntity } from "../../mob/entity/mobEntity"
import { newMob } from "../../mob/factory/mobFactory"
import { RaceType } from "../../mob/race/enum/raceType"

export function getTestMob(name: string = sillyname(), level: number = 1): MobEntity {
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
