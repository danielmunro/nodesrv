import { inject, injectable } from "inversify"
import {EventResponseStatus} from "../../event/enum/eventResponseStatus"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import {MobEntity} from "../../mob/entity/mobEntity"
import MobEvent from "../../mob/event/mobEvent"
import MobService from "../../mob/service/mobService"
import ClientService from "../../server/service/clientService"
import {Types} from "../../support/types"
import {Client} from "../client"

@injectable()
export default class ClientSessionEndedEventConsumer implements EventConsumer {
  constructor(
    @inject(Types.ClientService) private readonly clientService: ClientService,
    @inject(Types.MobService) private readonly mobService: MobService) {}

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.ClientLogout ]
  }

  public async consume(event: MobEvent): Promise<EventResponse> {
    const client = this.clientService.getClientByMob(event.mob)
    if (client) {
      await this.removeClient(client, event.mob)
    }
    return new EventResponse(event, EventResponseStatus.None)
  }

  private async removeClient(client: Client, mob: MobEntity) {
    await this.mobService.save(mob)
    this.clientService.remove(client)
    console.info("session ended", { mob: mob.name, client: client.ip })
  }
}
