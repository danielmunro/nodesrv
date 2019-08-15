import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import ResponseMessage from "../../messageExchange/responseMessage"
import {MobEntity} from "../../mob/entity/mobEntity"
import LocationService from "../../mob/service/locationService"
import ClientService from "../../server/service/clientService"
import RoomMessageEvent from "../event/roomMessageEvent"

export default class RoomMessageEventConsumer implements EventConsumer {
  constructor(
    private readonly clientService: ClientService,
    private readonly locationService: LocationService) {
  }

  public consume(event: RoomMessageEvent): Promise<EventResponse> {
    this.locationService.getMobsByRoom(event.room)
      .filter(mob => mob.playerMob !== undefined)
      .forEach(mob => this.sendMessage(mob, event.message))
    return EventResponse.none(event)
  }

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.RoomMessage ]
  }

  private sendMessage(mob: MobEntity, message: ResponseMessage) {
    this.clientService.sendMessageToMob(mob, message.getMessageToObservers())
  }
}
