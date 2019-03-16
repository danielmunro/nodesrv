import {v4} from "uuid"
import {Client} from "../../client/client"
import EventService from "../../event/eventService"
import {EventType} from "../../event/eventType"
import TimeService from "../../gameService/timeService"
import MobEvent from "../../mob/event/mobEvent"
import LocationService from "../../mob/locationService"
import MobLocation from "../../mob/model/mobLocation"
import {Observer} from "./observer"

const MESSAGE_HUNGRY = "You are hungry."
const TIMING = "tick notification duration"

export class Tick implements Observer {
  constructor(
    private readonly timeService: TimeService,
    private readonly eventService: EventService,
    private readonly locationService: LocationService) {}

  public async notify(clients: Client[]): Promise<void> {
    console.time(TIMING)
    const id = v4()
    const timestamp = new Date()
    this.timeService.incrementTime()
    await Promise.all(clients
      .filter(client => client.isLoggedIn())
      .map(client => this.notifyClient(client, id, timestamp)))
    console.log(`tick at ${timestamp}`)
    console.timeEnd(TIMING)
  }

  private async notifyClient(client: Client, id: string, timestamp: Date) {
    const mob = client.getSessionMob()
    mob.regen()

    if (mob.playerMob && mob.playerMob.isHungry()) {
      client.sendMessage(MESSAGE_HUNGRY)
    }

    const location = this.locationService.getLocationForMob(mob)
    await this.eventService.publish(new MobEvent(EventType.Tick, mob, location.room))
    client.tick(id, timestamp)
  }
}
