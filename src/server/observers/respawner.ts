import { Client } from "../../client/client"
import { Disposition, onlyLiving } from "../../mob/disposition"
import { Mob } from "../../mob/model/mob"
import { getMobs } from "../../mob/table"
import { getRoom } from "../../room/table"
import { Observer } from "./observer"

async function respawn(mob: Mob) {
  mob.disposition = Disposition.Standing
  const combined = mob.getCombinedAttributes()
  mob.vitals.hp = combined.vitals.hp
  mob.vitals.mana = combined.vitals.mana
  mob.vitals.mv = combined.vitals.mv
  getRoom(mob.startRoom.uuid).addMob(mob)
}

export default class Respawner implements Observer {
  public async notify(clients: Client[]): Promise<void> {
    getMobs().filter((mob) => !onlyLiving(mob)).forEach(respawn)
  }
}
