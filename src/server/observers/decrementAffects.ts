import { Client } from "../../client/client"
import { Observer } from "./observer"
import Table from "../../mob/table"

export function decrementAffects(mob) {
  mob.affects = mob.affects.filter((affect) => {
    affect.timeout--
    return affect.timeout >= 0
  })
}

export class DecrementAffects implements Observer {
  constructor(private readonly table: Table) {}

  public notify(clients: Client[]): void {
    this.table.apply(decrementAffects)
  }
}
