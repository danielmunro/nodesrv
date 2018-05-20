import { newStartingVitals } from "../../../attributes/factory"
import { Mob } from "../../../mob/model/mob"
import { Player } from "../../../player/model/player"
import { Request } from "../../../server/request/request"
import AuthStep from "../authStep"
import { MESSAGE_NEW_MOB_CONFIRM } from "../constants"
import Name from "../login/name"
import Password from "./password"

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

  public async processRequest(request: Request): Promise<any> {
    const response = request.command

    if (response === "n") {
      return new Name(this.player)
    }

    if (response === "y") {
      const mob = new Mob()
      mob.vitals = newStartingVitals()
      mob.name = this.name
      mob.isPlayer = true
      return new Password(mob)
    }

    return this
  }
}
