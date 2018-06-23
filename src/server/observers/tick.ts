import { v4 } from "uuid"
import { Client } from "../../client/client"
import { Observer } from "./observer"

export class Tick implements Observer {
  public notify(clients: Client[]): void {
    const id = v4()
    const timestamp = new Date()

    clients.forEach((it) => it.tick(id, timestamp))
  }
}
