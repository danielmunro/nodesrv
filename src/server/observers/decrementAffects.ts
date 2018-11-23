import { Client } from "../../client/client"
import MobTable from "../../mob/mobTable"
import { Observer } from "./observer"

export function decrementAffects(mob) {
  mob.affects = mob.affects.filter((affect) => {
    affect.timeout--
    return affect.timeout >= 0
  })
}

export class DecrementAffects implements Observer {
  constructor(private readonly table: MobTable) {}

  public notify(clients: Client[]): void {
    this.table.apply(decrementAffects)
  }
}
