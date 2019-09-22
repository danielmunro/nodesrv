import { inject, injectable } from "inversify"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import LocationService from "../../mob/service/locationService"
import MobService from "../../mob/service/mobService"
import {Types} from "../../support/types"
import ClientEvent from "../event/clientEvent"

@injectable()
export default class ClientDisconnectRemoveMobEventConsumer implements EventConsumer {
  constructor(
    @inject(Types.MobService) private readonly mobService: MobService,
    @inject(Types.LocationService) private readonly locationService: LocationService) {}

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.ClientDisconnected ]
  }

  public async isEventConsumable(event: ClientEvent): Promise<boolean> {
    return event.client.isLoggedIn()
  }

  public async consume(event: ClientEvent): Promise<EventResponse> {
    const mob = event.client.getSessionMob()
    await this.mobService.save(mob)
    this.locationService.removeMob(mob)
    return EventResponse.none(event)
  }
}
