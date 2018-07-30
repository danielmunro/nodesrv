import { Client } from "../../client/client"
import { Disposition } from "../../mob/disposition"
import { Mob } from "../../mob/model/mob"
import { getMobs } from "../../mob/table"
import { Observer } from "./observer"

function respawn(mob: Mob) {
  mob.disposition = Disposition.Standing
  const combined = mob.getCombinedAttributes()
  mob.vitals.hp = combined.vitals.hp
  mob.vitals.mana = combined.vitals.mana
  mob.vitals.mv = combined.vitals.mv
}

export default class Respawner implements Observer {
  public notify(clients: Client[]): void {
    getMobs().filter((mob) => mob.disposition === Disposition.Dead)
      .forEach((mob) => respawn(mob))
  }
}
