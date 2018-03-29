import { Client } from "../../client/client"
import { Observer } from "./observer"

export class HandleClientRequests implements Observer {
  public notify(clients: Client[]): void {
    clients.map((client) => {
      if (client.hasRequests() && client.getPlayer().delay === 0) {
        client.handleNextRequest()
      }
    })
  }
}
