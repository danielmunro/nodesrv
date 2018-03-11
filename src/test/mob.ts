import { Mob } from "./../mob/model/mob"
import { getTestRoom } from "./room"

export function getTestMob(): Mob {
  const mob = new Mob()
  mob.name = "test"
  mob.room = getTestRoom()

  return mob
}
