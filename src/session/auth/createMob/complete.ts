import { persistMob } from "../../../mob/repository/mob"
import AuthStep from "../authStep"
import { default as FinalComplete } from "../complete"
import { MESSAGE_COMPLETE } from "../constants"
import PlayerAuthStep from "../playerAuthStep"
import Request from "../request"
import Response from "../response"

export default class Complete extends PlayerAuthStep implements AuthStep {
  /* istanbul ignore next */
  public getStepMessage(): string {
    return MESSAGE_COMPLETE
  }

  public async processRequest(request: Request): Promise<Response> {
    await persistMob(this.player.sessionMob)

    return request.ok(new FinalComplete(this.player))
  }
}
