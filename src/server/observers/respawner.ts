import ResetService from "../../gameService/resetService"
import { Mob } from "../../mob/model/mob"
import { Observer } from "./observer"

export default class Respawner implements Observer {
  constructor(private readonly resetService: ResetService) {}

  public async notify(): Promise<void> {
    const deadMobs = await this.resetService.pruneDeadMobs()
    const deadMobsLength = deadMobs.length
    for (let i = 0; i < deadMobsLength; i++) {
      const deadMob = deadMobs[i]
      await this.respawn(deadMob)
    }
    console.log(`reset service done with ${deadMobsLength} mobs reset`)
  }

  public async respawn(mob: Mob) {
    const mobReset = mob.mobReset
    await this.resetService.respawnFromMobReset(mobReset)
  }

  public async seedMobTable() {
    await this.resetService.seedMobTable()
  }
}
