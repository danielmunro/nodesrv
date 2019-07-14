import {MobEntity} from "../../../../mob/entity/mobEntity"
import Maybe from "../../../../support/functional/maybe/maybe"
import {CreationMessages} from "../../constants"
import Request from "../../request"
import Response from "../../response"
import AuthStep from "../authStep"
import Complete from "../complete"
import NewMobConfirm from "../createMob/newMobConfirm"
import PlayerAuthStep from "../playerAuthStep"

export default class Name extends PlayerAuthStep implements AuthStep {
  /* istanbul ignore next */
  public getStepMessage(): string {
    return CreationMessages.Mob.NamePrompt
  }

  public async processRequest(request: Request): Promise<Response> {
    const name = request.input
    return new Maybe<MobEntity>(this.player.mobs.find(m => m.name === name))
      .maybe(mob => this.existingMobFound(request, mob))
      .or(async () => (await this.creationService.findOnePlayerMob(name))
        .maybe(() => request.fail(this, CreationMessages.Mob.NameUnavailable))
        .or(() => request.ok(new NewMobConfirm(this.creationService, this.player, name)))
        .get())
      .get()
  }

  private async existingMobFound(request: Request, mob: MobEntity): Promise<Response> {
    this.player.sessionMob = mob
    return request.ok(new Complete(this.creationService, this.player))
  }
}
