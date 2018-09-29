import { Player } from "../../player/model/player"
import { CostType } from "./costType"

export default class Cost {
  constructor(public readonly costType: CostType, public readonly amount: number) {}

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
}
