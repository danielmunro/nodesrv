import { newAttributes, newHitroll, newStartingVitals, newStats } from "../attributes/factory"
import { newMob } from "../mob/factory"
import { Mob } from "../mob/model/mob"
import { Race } from "../mob/race/race"
import { getTestRoom } from "./room"

export function getTestMob(name: string = "test"): Mob {
  const mob = newMob(
    name,
    "a test fixture",
    Race.Human,
    newStartingVitals(),
    newAttributes(
      newStartingVitals(),
      newStats(0, 0, 0, 0, 0, 0),
      newHitroll(1, 1)))
  mob.room = getTestRoom()
  mob.room.addMob(mob)

  return mob
}
