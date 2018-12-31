import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {EventResponseStatus} from "../../event/eventResponseStatus"
import {EventType} from "../../event/eventType"
import MobEvent from "../../mob/event/mobEvent"
import MobService from "../../mob/mobService"
import {Room} from "../../room/model/room"

export default class MobCreated implements EventConsumer {
  constructor(
    private readonly mobService: MobService,
    private readonly startRoom: Room) {}

  public getConsumingEventTypes(): EventType[] {
    return [EventType.MobCreated]
  }

  public consume(event: MobEvent): Promise<EventResponse> {
    this.mobService.add(event.mob, this.startRoom)
    return Promise.resolve(new EventResponse(event, EventResponseStatus.None))
  }
}
