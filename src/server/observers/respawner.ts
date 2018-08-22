import { Client } from "../../client/client"
import { Disposition, onlyLiving } from "../../mob/disposition"
import { Mob } from "../../mob/model/mob"
import { getMobs } from "../../mob/table"
import Table from "../../room/table"
import { Observer } from "./observer"

export default class Respawner implements Observer {
  constructor(
    private table: Table,
  ) {}

  public async notify(clients: Client[]): Promise<void> {
    getMobs().filter((mob) => !onlyLiving(mob)).forEach(this.respawn)
  }

  private async respawn(mob: Mob) {
    mob.disposition = Disposition.Standing
    const combined = mob.getCombinedAttributes()
    mob.vitals.hp = combined.vitals.hp
    mob.vitals.mana = combined.vitals.mana
    mob.vitals.mv = combined.vitals.mv
    this.table.canonical(mob.startRoom).addMob(mob)
  }
}
