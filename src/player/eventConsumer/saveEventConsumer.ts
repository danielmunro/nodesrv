import { inject, injectable } from "inversify"
import {Client} from "../../client/client"
import ClientService from "../../client/service/clientService"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import TickEvent from "../../mob/event/tickEvent"
import MobService from "../../mob/service/mobService"
import {Types} from "../../support/types"
import PlayerService from "../service/playerService"

@injectable()
export default class SaveEventConsumer implements EventConsumer {
  constructor(
    @inject(Types.ClientService) private readonly clientService: ClientService,
    @inject(Types.PlayerService) private readonly playerService: PlayerService,
    @inject(Types.MobService) private readonly mobService: MobService) {}

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.Tick ]
  }

  public async consume(event: TickEvent): Promise<EventResponse> {
    await Promise.all(this.clientService.getLoggedInClients().map(async client => this.save(client)))
    return EventResponse.none(event)
  }

  private async save(client: Client) {
    await this.playerService.save(client.player)
    await this.mobService.save(client.getSessionMob())
  }
}
