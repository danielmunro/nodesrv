import { Client } from "../../client/client"
import { newMobLocation } from "../../mob/factory"
import LocationService from "../../mob/locationService"
import MobReset from "../../mob/model/mobReset"
import { default as MobTable } from "../../mob/table"
import RoomTable from "../../room/roomTable"
import ResetService from "../../service/reset/resetService"
import { Observer } from "./observer"

export default class Respawner implements Observer {
  constructor(
    private readonly mobTable: MobTable,
    private readonly roomTable: RoomTable,
    private readonly resetService: ResetService,
    private readonly locationService: LocationService,
  ) {}

  public async notify(clients: Client[]): Promise<void> {
    this.resetService.mobResets.forEach(this.respawnMob.bind(this))
    console.log(`reset service done with ${this.resetService.mobResets.length} mobs reset`)
    console.log(`location service has ${this.locationService.getMobLocationCount()} mobs`)
  }

  private async respawnMob(mobReset: MobReset) {
    if (!mobReset.room || !mobReset.mob) {
      console.log(`mobReset ${mobReset.id} corrupt`)
      return
    }
    const mob = this.mobTable.find(m =>  m.uuid === mobReset.mob.uuid)
    const room = this.roomTable.get(mobReset.room.uuid)
    mob.disposition = mobReset.disposition
    const combined = mob.getCombinedAttributes()
    mob.vitals.hp = combined.vitals.hp
    mob.vitals.mana = combined.vitals.mana
    mob.vitals.mv = combined.vitals.mv
    this.locationService.addMobLocation(newMobLocation(mob, room))
  }
}
