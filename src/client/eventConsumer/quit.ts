import {EventResponseStatus} from "../../event/enum/eventResponseStatus"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import {MobEntity} from "../../mob/entity/mobEntity"
import MobEvent from "../../mob/event/mobEvent"
import MobService from "../../mob/service/mobService"
import ClientService from "../../server/service/clientService"
import withValue from "../../support/functional/withValue"
import {Client} from "../client"

export default class Quit implements EventConsumer {
  constructor(
    private readonly clientService: ClientService,
    private readonly mobService: MobService) {}

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.ClientLogout ]
  }

  public async consume(event: MobEvent): Promise<EventResponse> {
    withValue(this.clientService.getClientByMob(event.mob),
        client => this.removeClient(client))
    return new EventResponse(event, EventResponseStatus.None)
  }

  private async removeClient(client: Client) {
    withValue(client.getSessionMob(), mob => this.saveSessionMob(mob))
    this.clientService.remove(client)
  }

  private async saveSessionMob(mob: MobEntity) {
    await this.mobService.save(mob)
    console.info("mob leaving realm", { mob: mob.name })
  }
}
