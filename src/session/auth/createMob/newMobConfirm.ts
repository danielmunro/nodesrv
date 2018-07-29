import { newAttributes, newHitroll, newStartingStats, newStartingVitals } from "../../../attributes/factory"
import { Mob } from "../../../mob/model/mob"
import { Player } from "../../../player/model/player"
import AuthStep from "../authStep"
import { MESSAGE_NEW_MOB_CONFIRM, MESSAGE_YN_FAILED } from "../constants"
import Name from "../login/name"
import Request from "../request"
import Response from "../response"
import Race from "./race"
import { PlayerMob } from "../../../mob/model/playerMob"

export default class NewMobConfirm implements AuthStep {
  public readonly player: Player
  public readonly name: string

  constructor(player: Player, name: string) {
    this.player = player
    this.name = name
  }

  /* istanbul ignore next */
  public getStepMessage(): string {
    return MESSAGE_NEW_MOB_CONFIRM
  }

  public async processRequest(request: Request): Promise<Response> {
    if (request.didDeny()) {
      return request.ok(new Name(this.player))
    } else if (request.didConfirm()) {
      const mob = this.createMob()
      this.player.mobs.push(mob)
      this.player.sessionMob = mob
      return request.ok(new Race(this.player))
    }

    return request.fail(this, MESSAGE_YN_FAILED)
  }

  private createMob(): Mob {
    const mob = new Mob()
    mob.vitals = newStartingVitals()
    mob.name = this.name
    mob.isPlayer = true
    mob.player = this.player
    mob.attributes.push(newAttributes(
      newStartingVitals(),
      newStartingStats(),
      newHitroll(0, 0),
    ))
    mob.playerMob = new PlayerMob()

    return mob
  }
}
