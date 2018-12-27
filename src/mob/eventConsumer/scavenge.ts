import MobEvent from "../event/mobEvent"
import EventConsumer from "../../event/eventConsumer"
import {EventResponse} from "../../event/eventResponse"
import {EventType} from "../../event/eventType"
import ItemService from "../../item/itemService"
import ClientService from "../../server/clientService"
import LocationService from "../locationService"
import {Mob} from "../model/mob"

export const SCAVENGE_TIMEOUT_MS = 10000

export default class Scavenge implements EventConsumer {
  constructor(
    private readonly clientService: ClientService,
    private readonly itemService: ItemService,
    private readonly locationService: LocationService,
    private readonly scavengeTimeoutMS: number = SCAVENGE_TIMEOUT_MS) {}

  public getConsumingEventTypes(): EventType[] {
    return [EventType.MobArrived, EventType.ItemDropped]
  }

  public async consume(event: MobEvent): Promise<EventResponse> {
    if (event.mob.traits.scavenger) {
      this.scavenge(event.mob)
    }
    return Promise.resolve(EventResponse.None)
  }

  private scavenge(mob: Mob) {
    setTimeout(() => {
      const location = this.locationService.getLocationForMob(mob)
      const items = this.itemService.findAllByInventory(location.room.inventory)
      let message = ""
      items.forEach(item => {
        mob.inventory.addItem(item)
        message += `${mob.name} picks up ${item.name}.\n`
      })
      this.clientService.sendMessageInRoom(mob, message)
    }, this.scavengeTimeoutMS)
  }
}
