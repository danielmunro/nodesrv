import { Client } from "../../client/client"
import { Observer } from "./observer"

export class HandleClientRequests implements Observer {
  public notify(clients: Client[]): void {
    clients.forEach((client) => {
      if (client.canHandleRequests()) {
        client.handleNextRequest()
      }
    })
  }
}
