import Event from "../../event/event"
import { RequestType } from "../requestType"
import RequestContext from "./requestContext"

export default class EventContext implements RequestContext {
  constructor(
    public readonly requestType: RequestType,
    public readonly event: Event = null) {}

  public getRequestType(): RequestType {
    return this.requestType
  }

  public getSource(): any {
    return null
  }
}
