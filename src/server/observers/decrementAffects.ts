import {inject, injectable} from "inversify"
import "reflect-metadata"
import {Affect} from "../../affect/model/affect"
import {Mob} from "../../mob/model/mob"
import MobTable from "../../mob/table/mobTable"
import {Types} from "../../support/types"
import { Observer } from "./observer"

export function decrementAffects(mob: Mob) {
  mob.affects = mob.affects.filter((affect: Affect) => {
    affect.timeout--
    return affect.timeout >= 0
  })
}

@injectable()
export class DecrementAffects implements Observer {
  constructor(@inject(Types.MobTable) private readonly table: MobTable) {}

  public notify(): void {
    this.table.apply(decrementAffects)
  }
}
