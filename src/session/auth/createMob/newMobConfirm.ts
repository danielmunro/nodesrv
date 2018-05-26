import { newStartingVitals } from "../../../attributes/factory"
import { Mob } from "../../../mob/model/mob"
import { Player } from "../../../player/model/player"
import AuthStep from "../authStep"
import { MESSAGE_NEW_MOB_CONFIRM, MESSAGE_YN_FAILED } from "../constants"
import Name from "../login/name"
import Request from "../request"
import Response from "../response"
import Race from "./race"

export default class NewMobConfirm implements AuthStep {
  public readonly player: Player
  public readonly name: string

  constructor(player: Player, name: string) {
    this.player = player
    this.name = name
  }

  public getStepMessage(): string {
    return MESSAGE_NEW_MOB_CONFIRM
  }

  public async processRequest(request: Request): Promise<Response> {
    if (request.didDeny()) {
      return request.ok(new Name(this.player))
    } else if (request.didConfirm()) {
      const mob = new Mob()
      mob.vitals = newStartingVitals()
      mob.name = this.name
      mob.isPlayer = true
      mob.player = this.player
      this.player.mobs.push(mob)
      this.player.sessionMob = mob
      return request.ok(new Race(this.player))
    }

    return request.fail(this, MESSAGE_YN_FAILED)
  }
}
