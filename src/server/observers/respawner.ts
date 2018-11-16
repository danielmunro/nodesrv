import { Client } from "../../client/client"
import { onlyLiving } from "../../mob/disposition"
import LocationService from "../../mob/locationService"
import { Mob } from "../../mob/model/mob"
import { default as MobTable } from "../../mob/table"
import ResetService from "../../service/reset/resetService"
import { Observer } from "./observer"

export default class Respawner implements Observer {
  constructor(
    private readonly mobTable: MobTable,
    private readonly resetService: ResetService,
    private readonly locationService: LocationService,
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
    const reset = this.resetService.mobResets.find(mobReset => mobReset.mob === mob)
    this.locationService.updateMobLocation(mob, reset.room)
  }
}
