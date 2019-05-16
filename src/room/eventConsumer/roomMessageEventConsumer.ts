import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {EventType} from "../../event/eventType"
import {Mob} from "../../mob/model/mob"
import LocationService from "../../mob/service/locationService"
import ResponseMessage from "../../request/responseMessage"
import ClientService from "../../server/clientService"
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

  private sendMessage(mob: Mob, message: ResponseMessage) {
    this.clientService.sendMessageToMob(mob, message.getMessageToObservers())
  }
}
