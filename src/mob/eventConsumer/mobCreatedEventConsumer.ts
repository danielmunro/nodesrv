import {EventResponseStatus} from "../../event/enum/eventResponseStatus"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {RoomEntity} from "../../room/entity/roomEntity"
import MobEvent from "../event/mobEvent"
import MobService from "../service/mobService"

export default class MobCreatedEventConsumer implements EventConsumer {
  constructor(
    private readonly mobService: MobService,
    private readonly startRoom: RoomEntity) {}

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.MobCreated ]
  }

  public async consume(event: MobEvent): Promise<EventResponse> {
    console.log("mob created event consumer")
    await this.mobService.add(event.mob, this.startRoom)
    return Promise.resolve(new EventResponse(event, EventResponseStatus.None))
  }
}
