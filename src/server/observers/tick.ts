import { v4 } from "uuid"
import { Client } from "../../client/client"
import GameService from "../../gameService/gameService"
import { Trigger } from "../../mob/enum/trigger"
import LocationService from "../../mob/locationService"
import { createSkillTriggerEvent } from "../../skill/trigger/factory"
import { Observer } from "./observer"

const MESSAGE_HUNGRY = "You are hungry."

export class Tick implements Observer {
  constructor(
    private readonly service: GameService,
    private readonly locationService: LocationService) {}

  public async notify(clients: Client[]): Promise<void> {
    const id = v4()
    const timestamp = new Date()
    this.service.incrementTime()

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
    await createSkillTriggerEvent(this.service, mob, Trigger.Tick, null, location.room)
    client.tick(id, timestamp)
  }
}
