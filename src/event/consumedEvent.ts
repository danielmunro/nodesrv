import Event from "./event"
import {EventResponse} from "./eventResponse"

export default class ConsumedEvent {
  constructor(
    public readonly event: Event,
    public readonly eventResponse: EventResponse,
  ) {}
}
