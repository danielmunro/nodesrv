import { Client } from "../../client/client"
import { Observer } from "./observer"

export class DecrementPlayerDelay implements Observer {
  public notify(clients: Client[]): void {
    clients.map((client) => {
      const player = client.player
      if (client.isLoggedIn() && player.delay > 0) {
        player.delay--
      }
    })
  }
}
