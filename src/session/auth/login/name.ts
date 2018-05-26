import { findPlayerMobByName } from "../../../mob/repository/mob"
import AuthStep from "../authStep"
import Complete from "../complete"
import { MESSAGE_NAME, MESSAGE_UNAVAILABLE } from "../constants"
import NewMobConfirm from "../createMob/newMobConfirm"
import PlayerAuthStep from "../playerAuthStep"
import Request from "../request"
import Response from "../response"

export default class Name extends PlayerAuthStep implements AuthStep {
  public getStepMessage(): string {
    return MESSAGE_NAME
  }

  public async processRequest(request: Request): Promise<Response> {
    const name = request.input
    const mob = await findPlayerMobByName(name)

    if (mob) {
      return this.existingMobFound(request, mob)
    }

    return request.ok(new NewMobConfirm(this.player, name))
  }

  private existingMobFound(request, mob): Response {
    if (!this.isMobOwnedByPlayer(mob)) {
      return request.fail(this, MESSAGE_UNAVAILABLE)
    }

    this.player.sessionMob = mob

    return request.ok(new Complete(this.player))
  }

  private isMobOwnedByPlayer(mob): boolean {
    return mob.player.id === this.player.id
  }
}
