import * as sillyname from "sillyname"
import {
  newAttributes, newHitroll, newStartingStats,
  newStartingVitals,
} from "../attributes/factory"
import { newMob } from "../mob/factory"
import { Mob } from "../mob/model/mob"
import { Race } from "../mob/race/race"
import { getTestRoom } from "./room"

export function getTestMob(name: string = null): Mob {
  if (name === null) {
    name = sillyname()
  }
  const mob = newMob(
    name,
    "a test fixture",
    Race.Human,
    newStartingVitals(),
    newAttributes(
      newStartingVitals(),
      newStartingStats(),
      newHitroll(0, 0),
    ))
  mob.room = getTestRoom()
  mob.room.addMob(mob)

  return mob
}
