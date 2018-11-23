import { Trigger } from "../../mob/enum/trigger"
import { RequestType } from "../requestType"
import RequestContext from "./requestContext"

export default class EventContext implements RequestContext {
  constructor(public readonly requestType: RequestType, public readonly trigger: Trigger) {}

  public getRequestType(): RequestType {
    return this.requestType
  }

  public getSource(): any {
    return this.trigger
  }
}
