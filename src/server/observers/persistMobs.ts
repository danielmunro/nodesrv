import { Client } from "../../client/client"
import { Observer } from "./observer"
import { saveMobs } from "./../../mob/model"

export class PersistMobs implements Observer {
  public notify(clients: Client[]): void {
    saveMobs(clients.map((it) => it.getPlayer().getMob()).filter((m) => m !== null))
  }
}