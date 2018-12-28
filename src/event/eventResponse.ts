import Event from "./event"
import {EventResponseStatus} from "./eventResponseStatus"

export default class EventResponse {
  constructor(
    public readonly event: Event,
    public readonly status: EventResponseStatus,
    public readonly context: any = null) {}

  public isSatisifed(): boolean {
    return this.status === EventResponseStatus.Satisfied
  }
}
