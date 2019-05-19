import {EventResponseStatus} from "../../event/enum/eventResponseStatus"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {Room} from "../../room/model/room"
import MobEvent from "../event/mobEvent"
import MobService from "../service/mobService"

export default class MobCreated implements EventConsumer {
  constructor(
    private readonly mobService: MobService,
    private readonly startRoom: Room) {}

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.MobCreated ]
  }

  public consume(event: MobEvent): Promise<EventResponse> {
    this.mobService.add(event.mob, this.startRoom)
    return Promise.resolve(new EventResponse(event, EventResponseStatus.None))
  }
}
