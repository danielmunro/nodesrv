import { Client } from "../../client/client"
import ResetService from "../../gameService/resetService"
import MobService from "../../mob/mobService"
import { Mob } from "../../mob/model/mob"
import MobReset from "../../mob/model/mobReset"
import RoomTable from "../../room/roomTable"
import { Observer } from "./observer"

export default class Respawner implements Observer {
  constructor(
    private readonly mobService: MobService,
    private readonly roomTable: RoomTable,
    private readonly resetService: ResetService,
  ) {}

  public async notify(clients: Client[]): Promise<void> {
    const deadMobs = this.mobService.pruneDeadMobs() // regenerate from these
    const deadMobsLength = deadMobs.length
    for (let i = 0; i < deadMobsLength; i++) {
      const deadMob = deadMobs[i]
      await this.respawn(deadMob)
    }
    console.log(`reset service done with ${this.resetService.mobResets.length} mobs reset`)
    console.log(`mob table has ${this.mobService.locationService.getMobLocationCount()} mobs`)
  }

  public async respawn(mob: Mob) {
    const mobReset = mob.mobReset
    await this.respawnFromReset(mobReset)
  }

  public async seedMobTable() {
    const mobResetLength = this.resetService.mobResets.length
    for (let i = 0; i < mobResetLength; i++) {
      const mobReset = this.resetService.mobResets[i]
      await this.respawnFromReset(mobReset)
    }
  }

  private async respawnFromReset(mobReset: MobReset) {
    const mob = await this.mobService.generateNewMobInstance(mobReset)
    const room = this.roomTable.get(mobReset.room.uuid)
    this.mobService.add(mob, room)

    return mob
  }
}
