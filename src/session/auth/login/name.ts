import { Mob } from "../../../mob/model/mob"
import Table from "../../../mob/table"
import { Player } from "../../../player/model/player"
import AuthStep from "../authStep"
import Complete from "../complete"
import { MESSAGE_NAME, MESSAGE_UNAVAILABLE } from "../constants"
import NewMobConfirm from "../createMob/newMobConfirm"
import PlayerAuthStep from "../playerAuthStep"
import Request from "../request"
import Response from "../response"

export default class Name extends PlayerAuthStep implements AuthStep {
  constructor(player: Player, private readonly mobTable: Table) {
    super(player)
  }

  /* istanbul ignore next */
  public getStepMessage(): string {
    return MESSAGE_NAME
  }

  public async processRequest(request: Request): Promise<Response> {
    const name = request.input
    const mob = this.mobTable.find((m: Mob) => m.name === name && m.isPlayer)

    if (mob) {
      return this.existingMobFound(request, mob)
    }

    return request.ok(new NewMobConfirm(this.player, name))
  }

  private async existingMobFound(request, mob): Promise<Response> {
    if (!this.player.ownsMob(mob)) {
      return request.fail(this, MESSAGE_UNAVAILABLE)
    }

    this.player.sessionMob = mob

    return request.ok(new Complete(this.player))
  }
}
