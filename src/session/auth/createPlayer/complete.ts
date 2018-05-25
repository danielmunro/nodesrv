import { savePlayer } from "../../../player/service"
import AuthStep from "../authStep"
import { MESSAGE_COMPLETE } from "../constants"
import Name from "../login/name"
import PlayerAuthStep from "../playerAuthStep"
import Request from "../request"
import Response from "../response"

export default class Complete extends PlayerAuthStep implements AuthStep {
  public getStepMessage(): string {
    return MESSAGE_COMPLETE
  }

  public async processRequest(request: Request): Promise<Response> {
    await savePlayer(this.player)

    return request.ok(new Name(this.player))
  }
}
