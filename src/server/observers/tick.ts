import { v4 } from "uuid"
import { Client } from "../../client/client"
import { Trigger } from "../../mob/trigger"
import { createSkillTriggerEvent } from "../../skill/trigger/factory"
import { Observer } from "./observer"

const MESSAGE_HUNGRY = "You are hungry."
const HOURS_IN_DAY = 24

export class Tick implements Observer {
  private static async notifyClient(client: Client, id: string, timestamp: Date) {
    const mob = client.getSessionMob()
    mob.regen()

    if (mob.playerMob && mob.playerMob.isHungry()) {
      client.sendMessage(MESSAGE_HUNGRY)
    }

    await createSkillTriggerEvent(mob, Trigger.Tick)

    client.tick(id, timestamp)
  }

  private hourInDay: number = 8

  public async notify(clients: Client[]): Promise<void> {
    const id = v4()
    const timestamp = new Date()
    this.hourInDay += 1

    if (this.hourInDay > HOURS_IN_DAY) {
      this.hourInDay = 0
    }

    await Promise.all(clients
      .filter(client => client.isLoggedIn())
      .map(client => Tick.notifyClient(client, id, timestamp)))

    console.log(`tick at ${timestamp}`)
  }
}
