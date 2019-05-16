import AuthStep from "../authStep"
import { default as FinalComplete } from "../complete"
import {CreationMessages} from "../constants"
import PlayerAuthStep from "../playerAuthStep"
import Request from "../request"
import Response from "../response"

export default class Complete extends PlayerAuthStep implements AuthStep {
  /* istanbul ignore next */
  public getStepMessage(): string {
    return CreationMessages.All.Done
  }

  public async processRequest(request: Request): Promise<Response> {
    return request.ok(new FinalComplete(this.creationService, this.player))
  }
}
