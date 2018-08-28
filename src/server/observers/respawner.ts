import { Client } from "../../client/client"
import { Disposition, onlyLiving } from "../../mob/disposition"
import { Mob } from "../../mob/model/mob"
import { default as MobTable } from "../../mob/table"
import { default as RoomTable } from "../../room/table"
import { Observer } from "./observer"

export default class Respawner implements Observer {
  constructor(
    private readonly roomTable: RoomTable,
    private readonly mobTable: MobTable,
  ) {}

  public async notify(clients: Client[]): Promise<void> {
    await Promise.all(
      this.mobTable.getMobs().filter((mob) => !onlyLiving(mob)).map(this.respawn.bind(this)))
  }

  private async respawn(mob: Mob) {
    mob.disposition = Disposition.Standing
    const combined = mob.getCombinedAttributes()
    mob.vitals.hp = combined.vitals.hp
    mob.vitals.mana = combined.vitals.mana
    mob.vitals.mv = combined.vitals.mv
    this.roomTable.canonical(mob.startRoom).addMob(mob)
  }
}
