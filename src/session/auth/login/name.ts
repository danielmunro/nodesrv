import {MobEntity} from "../../../mob/entity/mobEntity"
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
    let mob = this.player.mobs.find(m => m.name === name)

    if (mob) {
      return this.existingMobFound(request, mob)
    }

    mob = await this.creationService.findOnePlayerMob(name)

    if (mob) {
      return request.fail(this, CreationMessages.Mob.NameUnavailable)
    }

    return request.ok(new NewMobConfirm(this.creationService, this.player, name))
  }

  private async existingMobFound(request: Request, mob: MobEntity): Promise<Response> {
    this.player.sessionMob = mob
    return request.ok(new Complete(this.creationService, this.player))
  }
}
