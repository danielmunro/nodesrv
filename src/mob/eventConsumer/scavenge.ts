import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import ItemService from "../../item/itemService"
import ClientService from "../../server/clientService"
import MobEvent from "../event/mobEvent"
import {Mob} from "../model/mob"
import MobLocation from "../model/mobLocation"
import LocationService from "../service/locationService"

export const SCAVENGE_TIMEOUT_MS = 10000

export default class Scavenge implements EventConsumer {
  constructor(
    private readonly clientService: ClientService,
    private readonly itemService: ItemService,
    private readonly locationService: LocationService,
    private readonly scavengeTimeoutMS: number = SCAVENGE_TIMEOUT_MS) {}

  public getConsumingEventTypes(): EventType[] {
    return [EventType.MobMoved, EventType.ItemDropped]
  }

  public async consume(event: MobEvent): Promise<EventResponse> {
    if (event.mob.traits.scavenger) {
      setTimeout(() => this.scavenge(event.mob), this.scavengeTimeoutMS)
    }
    return EventResponse.none(event)
  }

  public scavenge(mob: Mob) {
    const location = this.locationService.getLocationForMob(mob)
    const items = this.itemService.findAllByInventory(location.room.inventory)
    let message = ""
    items.forEach(item => {
      mob.inventory.addItem(item)
      message += `${mob.name} picks up ${item.name}.\n`
    })
    this.clientService.sendMessageInRoom(mob, message)
  }
}
