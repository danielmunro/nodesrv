import { Client } from "../../client/client"
import { Observer } from "./observer"
import { savePlayers } from "./../../player/model"

export class PersistPlayers implements Observer {
  public notify(clients: Client[]): void {
    savePlayers(clients.map((it) => it.getPlayer()))
  }
}