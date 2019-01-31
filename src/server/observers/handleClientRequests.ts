import { Client } from "../../client/client"
import { Observer } from "./observer"

export class HandleClientRequests implements Observer {
  public async notify(clients: Client[]): Promise<void> {
    clients
      .filter(client => client.canHandleRequests())
      .forEach(client => client.handleNextRequest())
  }
}
