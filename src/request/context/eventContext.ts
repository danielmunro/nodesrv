import Event from "../../event/event"
import { Trigger } from "../../mob/enum/trigger"
import { RequestType } from "../requestType"
import RequestContext from "./requestContext"

export default class EventContext implements RequestContext {
  constructor(
    public readonly requestType: RequestType,
    public readonly trigger: Trigger,
    public readonly event: Event = null) {}

  public getRequestType(): RequestType {
    return this.requestType
  }

  public getSource(): any {
    return this.trigger
  }
}
