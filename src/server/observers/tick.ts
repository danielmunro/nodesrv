import { v4 } from "uuid"
import { Client } from "../../client/client"
import { Observer } from "./observer"

const MESSAGE_HUNGRY = "You are hungry."
const HOURS_IN_DAY = 24

export class Tick implements Observer {
  private hourInDay: number = 8

  public notify(clients: Client[]): void {
    const id = v4()
    const timestamp = new Date()
    const clientsToUpdate = clients.filter((client) => client.isLoggedIn())
    this.hourInDay += 1
    if (this.hourInDay > HOURS_IN_DAY) {
      this.hourInDay = 0
    }

    console.log(`tick at ${timestamp}`)

    clientsToUpdate.forEach((it) => {
      const mob = it.getSessionMob()
      mob.regen()
      if (mob.playerMob && mob.playerMob.isHungry()) {
        it.sendMessage(MESSAGE_HUNGRY)
      }
      it.tick(id, timestamp)
    })
  }
}
