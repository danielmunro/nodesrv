import { v4 } from "uuid"
import { Client } from "../../client/client"
import LocationService from "../../mob/locationService"
import { Trigger } from "../../mob/trigger"
import { createSkillTriggerEvent } from "../../skill/trigger/factory"
import { Observer } from "./observer"

const MESSAGE_HUNGRY = "You are hungry."
const HOURS_IN_DAY = 24

export class Tick implements Observer {
  private hourInDay: number = 8

  constructor(private readonly locationService: LocationService) {}

  public async notify(clients: Client[]): Promise<void> {
    const id = v4()
    const timestamp = new Date()
    this.hourInDay += 1

    if (this.hourInDay > HOURS_IN_DAY) {
      this.hourInDay = 0
    }

    await Promise.all(clients
      .filter(client => client.isLoggedIn())
      .map(client => this.notifyClient(client, id, timestamp)))

    console.log(`tick at ${timestamp}`)
  }

  private async notifyClient(client: Client, id: string, timestamp: Date) {
    const mob = client.getSessionMob()
    mob.regen()

    if (mob.playerMob && mob.playerMob.isHungry()) {
      client.sendMessage(MESSAGE_HUNGRY)
    }

    const location = this.locationService.getLocationForMob(mob)
    await createSkillTriggerEvent(mob, Trigger.Tick, null, location.room)

    client.tick(id, timestamp)
  }
}
