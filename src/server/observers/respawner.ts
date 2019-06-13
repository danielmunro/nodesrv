import {inject, injectable} from "inversify"
import ResetService from "../../gameService/resetService"
import { MobEntity } from "../../mob/entity/mobEntity"
import {Types} from "../../support/types"
import { Observer } from "./observer"

@injectable()
export default class Respawner implements Observer {
  constructor(@inject(Types.ResetService) private readonly resetService: ResetService) {}

  public async notify(): Promise<void> {
    const deadMobs = await this.resetService.pruneDeadMobs()
    const deadMobsLength = deadMobs.length
    for (let i = 0; i < deadMobsLength; i++) {
      const deadMob = deadMobs[i]
      await this.respawn(deadMob)
    }
    console.log(`reset service done with ${deadMobsLength} mobs reset`)
  }

  public async respawn(mob: MobEntity) {
    try {
      await this.resetService.respawnFromMob(mob)
    } catch (e) {
      // ok -- mob is gone permanently
    }
  }

  public async seedMobTable() {
    await this.resetService.seedMobTable()
  }
}
