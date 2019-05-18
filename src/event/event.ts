import {EventType} from "./enum/eventType"

export default interface Event {
  getEventType(): EventType
}
