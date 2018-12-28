import Event from "./event"
import {EventResponseStatus} from "./eventResponseStatus"

export default class EventResponse {
  constructor(
    public readonly event: Event,
    public readonly eventResponseStatus: EventResponseStatus) {}
}
