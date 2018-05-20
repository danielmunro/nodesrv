import { newAttributes, newHitroll, newStartingStats, newStartingVitals } from "../../attributes/factory"
import { Mob } from "../../mob/model/mob"
import { Player } from "../../player/model/player"
import { Request } from "../../server/request/request"
import AuthStep from "./authStep"
import { MESSAGE_COMPLETE } from "./constants"
import Password from "./login/password"

export default class Complete implements AuthStep {
  public readonly player: Player

  constructor(player: Player) {
    this.player = player
  }

  public getStepMessage(): string {
    return MESSAGE_COMPLETE
  }

  public async processRequest(request: Request): Promise<any> {
    return this
  }
}
