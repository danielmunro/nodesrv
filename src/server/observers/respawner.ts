import { Client } from "../../client/client"
import { onlyLiving } from "../../mob/disposition"
import { Mob } from "../../mob/model/mob"
import { default as MobTable } from "../../mob/table"
import { default as RoomTable } from "../../room/table"
import { Observer } from "./observer"
import ResetService from "../../service/reset/resetService"

export default class Respawner implements Observer {
  constructor(
    private readonly roomTable: RoomTable,
    private readonly mobTable: MobTable,
    private readonly resetService: ResetService,
  ) {}

  public async notify(clients: Client[]): Promise<void> {
    await Promise.all(
      this.mobTable
        .getMobs()
        .filter(mob => !onlyLiving(mob))
        .map(mob => this.respawnMob(mob)))
  }

  private async respawnMob(mob: Mob) {
    mob.disposition = mob.reset.disposition
    const combined = mob.getCombinedAttributes()
    mob.vitals.hp = combined.vitals.hp
    mob.vitals.mana = combined.vitals.mana
    mob.vitals.mv = combined.vitals.mv
    this.roomTable.canonical(mob.reset.room).addMob(mob)
  }
}
