import { v4 } from "uuid"
import { Client } from "../../client/client"
import { Observer } from "./observer"

export class Tick implements Observer {
  public notify(clients: Client[]): void {
    const id = v4()
    const timestamp = new Date()

    clients.map((it) => it.send({tick: { id, timestamp }}))
  }
}