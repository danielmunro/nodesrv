import InputEvent from "../../client/event/inputEvent"
import DamageEvent from "../../mob/event/damageEvent"
import {EventResponseStatus} from "../enum/eventResponseStatus"
import Event from "../interface/event"

export default class EventResponse {
  public static async satisfied(event: Event, context: any = null): Promise<EventResponse> {
    return Promise.resolve(new EventResponse(event, EventResponseStatus.Satisfied, context))
  }

  public static async none(event: Event): Promise<EventResponse> {
    return Promise.resolve(new EventResponse(event, EventResponseStatus.None))
  }

  public static modified(event: Event): Promise<EventResponse> {
    return Promise.resolve(new EventResponse(event, EventResponseStatus.Modified))
  }

  constructor(
    public readonly event: Event,
    public readonly status: EventResponseStatus,
    public readonly context: any = null) {}

  public isSatisfied(): boolean {
    return this.status === EventResponseStatus.Satisfied
  }

  public isModified(): boolean {
    return this.status === EventResponseStatus.Modified
  }

  public getInputEvent(): InputEvent {
    return this.event as InputEvent
  }

  public getDamageEvent(): DamageEvent {
    return this.event as DamageEvent
  }
}
