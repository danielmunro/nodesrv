import { v4 } from "uuid"
import { Client } from "../../client/client"
import { Observer } from "./observer"

const MESSAGE_HUNGRY = "You are hungry."

export class Tick implements Observer {
  public notify(clients: Client[]): void {
    const id = v4()
    const timestamp = new Date()
    const clientsToUpdate = clients.filter((client) => client.isLoggedIn())

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
