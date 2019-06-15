import {CreationMessages} from "../../constants"
import Request from "../../request"
import Response from "../../response"
import AuthStep from "../authStep"
import Name from "../login/name"
import PlayerAuthStep from "../playerAuthStep"

export default class Complete extends PlayerAuthStep implements AuthStep {
  /* istanbul ignore next */
  public getStepMessage(): string {
    return CreationMessages.Player.PlayerDone
  }

  public async processRequest(request: Request): Promise<Response> {
    await this.creationService.savePlayer(this.player)

    return request.ok(new Name(this.creationService, this.player))
  }
}
