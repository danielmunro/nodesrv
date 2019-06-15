import {CreationMessages} from "../constants"
import Request from "../request"
import Response from "../response"
import AuthStep from "./authStep"
import PlayerAuthStep from "./playerAuthStep"

export default class Complete extends PlayerAuthStep implements AuthStep {
  /* istanbul ignore next */
  public getStepMessage(): string {
    return CreationMessages.All.Done
  }

  public async processRequest(request: Request): Promise<Response> {
    return request.ok(this)
  }
}
