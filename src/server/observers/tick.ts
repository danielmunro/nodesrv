import { v4 } from "uuid"
import { Client } from "../../client/client"
import { Observer } from "./observer"

const MESSAGE_HUNGRY = "You are hungry."

export class Tick implements Observer {
  public notify(clients: Client[]): void {
    const id = v4()
    const timestamp = new Date()

    clients.forEach((it) => {
      const mob = it.getSessionMob()
      if (mob) {
        mob.regen()
        if (mob.hunger === 0) {
          it.send({ message: MESSAGE_HUNGRY })
        }
      }
      it.tick(id, timestamp)
    })
  }
}
