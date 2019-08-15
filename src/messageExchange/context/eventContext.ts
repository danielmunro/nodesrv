import Event from "../../event/interface/event"
import RequestContext from "./requestContext"

export default interface EventContext extends RequestContext {
  readonly event?: Event
}
