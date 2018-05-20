import { findPlayerMobByName } from "../../../mob/repository/mob"
import { Player } from "../../../player/model/player"
import { Request } from "../../../server/request/request"
import AuthStep from "../authStep"
import Complete from "../complete"
import { MESSAGE_NAME } from "../constants"
import NewMobConfirm from "../createMob/newMobConfirm"
import Password from "../login/password"

export default class Name implements AuthStep {
  public readonly player: Player

  constructor(player: Player) {
    this.player = player
  }

  public getStepMessage(): string {
    return MESSAGE_NAME
  }

  public async processRequest(request: Request): Promise<any> {
    const name = request.command
    const mob = await findPlayerMobByName(name)

    if (mob) {
      this.player.sessionMob = mob

      return new Complete(this.player)
    }

    return new NewMobConfirm(this.player, name)
  }
}
