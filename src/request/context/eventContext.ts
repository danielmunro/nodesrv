import Event from "../../event/event"
import RequestContext from "./requestContext"

export default interface EventContext extends RequestContext {
  readonly event?: Event
}
