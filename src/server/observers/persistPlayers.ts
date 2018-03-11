import { Client } from "../../client/client"
import { Observer } from "./observer"

export class PersistPlayers implements Observer {
  public notify(clients: Client[]): void {
    // savePlayers(clients.map((it) => it.getPlayer()))
  }
}
