import {EventResponseStatus} from "../../event/enum/eventResponseStatus"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import {RoomEntity} from "../../room/entity/roomEntity"
import ClientService from "../../server/service/clientService"
import {format} from "../../support/string"
import MobEvent from "../event/mobEvent"
import MobService from "../service/mobService"
import {Messages} from "./constants"

export default class MobCreatedEventConsumer implements EventConsumer {
  constructor(
    private readonly mobService: MobService,
    private readonly clientService: ClientService,
    private readonly startRoom: RoomEntity) {}

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.MobCreated ]
  }

  public async consume(event: MobEvent): Promise<EventResponse> {
    await this.mobService.add(event.mob, this.startRoom)
    this.clientService.sendMessageInRoom(event.mob, format(Messages.Mob.EntersRealm, event.mob.name))
    return Promise.resolve(new EventResponse(event, EventResponseStatus.None))
  }
}