import { Client } from "../../client/client"
import { newMobLocation } from "../../mob/factory"
import LocationService from "../../mob/locationService"
import MobReset from "../../mob/model/mobReset"
import { default as MobTable } from "../../mob/table"
import RoomTable from "../../room/roomTable"
import ResetService from "../../service/reset/resetService"
import { Observer } from "./observer"
import MobRepository from "../../mob/repository/mob"

export default class Respawner implements Observer {
  constructor(
    private readonly mobRepository: MobRepository,
    private readonly mobTable: MobTable,
    private readonly roomTable: RoomTable,
    private readonly resetService: ResetService,
    private readonly locationService: LocationService,
  ) {}

  public async notify(clients: Client[]): Promise<void> {
    const mobResetLength = this.resetService.mobResets.length


    for (let i = 0; i < mobResetLength; i++) {
      const mobReset = this.resetService.mobResets[i]
      const mob = await this.respawnMob(mobReset)
      const room = this.roomTable.get(mobReset.room.uuid)
      this.mobTable.add(mob)
      this.locationService.addMobLocation(newMobLocation(mob, room))
    }
    console.log(`reset service done with ${this.resetService.mobResets.length} mobs reset`)
    console.log(`location service has ${this.locationService.getMobLocationCount()} mobs`)
    console.log(`mob table has ${this.mobTable.getMobs().length} mobs`)
  }

  private pruneDeadMobs() {}

  private async respawnMob(mobReset: MobReset) {
    if (!mobReset.room || !mobReset.mob) {
      console.log(`mobReset ${mobReset.id} corrupt`)
      return
    }
    const mob = await this.mobRepository.findOneById(mobReset.mob.id)
    return Object.assign({}, mob, { id: null, uuid: null })
  }
}
