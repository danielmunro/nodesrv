import {EventType} from "./eventType"

export default interface Event {
  getEventType(): EventType
}
