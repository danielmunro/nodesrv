import AuthStep from "../authStep"
import {CreationMessages} from "../constants"
import Name from "../login/name"
import PlayerAuthStep from "../playerAuthStep"
import Request from "../request"
import Response from "../response"

export default class Complete extends PlayerAuthStep implements AuthStep {
  /* istanbul ignore next */
  public getStepMessage(): string {
    return CreationMessages.All.Done
  }

  public async processRequest(request: Request): Promise<Response> {
    await this.creationService.savePlayer(this.player)

    return request.ok(new Name(this.creationService, this.player))
  }
}
