import {EventResponseStatus} from "../../event/enum/eventResponseStatus"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import MobEvent from "../../mob/event/mobEvent"
import ClientService from "../../server/clientService"
import {Client} from "../client"

export default class Quit implements EventConsumer {
  constructor(private readonly clientService: ClientService) {}

  public getConsumingEventTypes(): EventType[] {
    return [EventType.ClientLogout]
  }

  public consume(event: MobEvent): Promise<EventResponse> {
    const client = this.clientService.getClientByMob(event.mob) as Client
    this.clientService.remove(client)
    client.ws.close()
    console.info("user quit", { mob: event.mob.name })
    return Promise.resolve(new EventResponse(event, EventResponseStatus.None))
  }
}
