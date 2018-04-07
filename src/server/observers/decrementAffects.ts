import { Client } from "../../client/client"
import { getMobs } from "../../mob/table"
import { Observer } from "./observer"

function affectDecrement(affect) {
  affect.timeout--
  return affect.timeout >= 0
}

export class DecrementAffects implements Observer {
  public notify(clients: Client[]): void {
    getMobs().map((mob) =>
      mob.affects = mob.affects.filter((affect) => affectDecrement(affect)))
  }
}
