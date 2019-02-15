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
    return request.ok(new FinalComplete(this.authService, this.player))
  }
}
