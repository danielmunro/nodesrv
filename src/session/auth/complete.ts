import { Request } from "../../server/request/request"
import AuthStep from "./authStep"
import { MESSAGE_COMPLETE } from "./constants"
import PlayerAuthStep from "./playerAuthStep"

export default class Complete extends PlayerAuthStep implements AuthStep {
  public getStepMessage(): string {
    return MESSAGE_COMPLETE
  }

  public async processRequest(request: Request): Promise<any> {
    return this
  }
}
