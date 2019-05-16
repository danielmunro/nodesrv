import {Mob} from "../../../mob/model/mob"
import AuthStep from "../authStep"
import Complete from "../complete"
import {CreationMessages} from "../constants"
import NewMobConfirm from "../createMob/newMobConfirm"
import PlayerAuthStep from "../playerAuthStep"
import Request from "../request"
import Response from "../response"

export default class Name extends PlayerAuthStep implements AuthStep {
  /* istanbul ignore next */
  public getStepMessage(): string {
    return CreationMessages.Mob.NamePrompt
  }

  public async processRequest(request: Request): Promise<Response> {
    const name = request.input
    const mob = this.creationService.findOnePlayerMob(name)

    if (mob && this.player.ownsMob(mob)) {
      return this.existingMobFound(request, mob)
    }

    if (mob) {
      return request.fail(this, CreationMessages.Mob.NameUnavailable)
    }

    return request.ok(new NewMobConfirm(this.creationService, this.player, name))
  }

  private async existingMobFound(request: Request, mob: Mob): Promise<Response> {
    this.player.sessionMob = mob
    return request.ok(new Complete(this.creationService, this.player))
  }
}
