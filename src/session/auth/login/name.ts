import { findPlayerMobByName } from "../../../mob/repository/mob"
import { Request } from "../../../server/request/request"
import AuthStep from "../authStep"
import Complete from "../complete"
import { MESSAGE_NAME } from "../constants"
import NewMobConfirm from "../createMob/newMobConfirm"
import PlayerAuthStep from "../playerAuthStep"

export default class Name extends PlayerAuthStep implements AuthStep {
  public getStepMessage(): string {
    return MESSAGE_NAME
  }

  public async processRequest(request: Request): Promise<any> {
    const name = request.command
    const mob = await findPlayerMobByName(name)

    if (mob) {
      if (mob.player.id !== this.player.id) {
        return this
      }

      this.player.sessionMob = mob

      return new Complete(this.player)
    }

    return new NewMobConfirm(this.player, name)
  }
}
