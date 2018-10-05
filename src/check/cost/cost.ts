import { Mob } from "../../mob/model/mob"
import { Player } from "../../player/model/player"
import { CostType } from "./costType"

export default class Cost {
  constructor(
    public readonly costType: CostType,
    public readonly amount: number,
    public readonly failMessage: string = "") {}

  public applyTo(player: Player): void {
    if (this.costType === CostType.Mv) {
      player.sessionMob.vitals.mv -= this.amount
      return
    }

    if (this.costType === CostType.Delay) {
      player.delay += this.amount
      return
    }

    if (this.costType === CostType.Train) {
      player.sessionMob.playerMob.trains -= this.amount
      return
    }
  }

  public canApply(mob: Mob): boolean {
    if (this.costType === CostType.Mv) {
      return mob.vitals.mv >= this.amount
    }

    if (this.costType === CostType.Delay) {
      return true
    }

    if (this.costType === CostType.Train) {
      return mob.playerMob.trains >= this.amount
    }
  }
}
