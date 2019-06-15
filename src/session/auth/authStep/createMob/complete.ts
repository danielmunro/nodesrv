import {CreationMessages} from "../../constants"
import Request from "../../request"
import Response from "../../response"
import AuthStep from "../authStep"
import { default as FinalComplete } from "../complete"
import PlayerAuthStep from "../playerAuthStep"

export default class Complete extends PlayerAuthStep implements AuthStep {
  /* istanbul ignore next */
  public getStepMessage(): string {
    return CreationMessages.All.Done
  }

  public async processRequest(request: Request): Promise<Response> {
    await this.creationService.saveMob(this.player.sessionMob)
    return request.ok(new FinalComplete(this.creationService, this.player))
  }
}
