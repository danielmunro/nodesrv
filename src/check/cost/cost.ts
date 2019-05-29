import { Mob } from "../../mob/model/mob"
import { Player } from "../../player/model/player"
import { CostType } from "./costType"

export default class Cost {
  constructor(
    public readonly costType: CostType,
    public readonly amount: ((mob: Mob) => number) | number,
    public readonly failMessage: string = "") {}

  public applyTo(player: Player): void {
    const calculatedAmount = this.getAmount(player.sessionMob)
    if (this.costType === CostType.Mv) {
      player.sessionMob.mv -= calculatedAmount
      return
    }

    if (this.costType === CostType.Mana) {
      player.sessionMob.mana -= calculatedAmount
      return
    }

    if (this.costType === CostType.Delay) {
      player.delay += calculatedAmount
      return
    }

    if (this.costType === CostType.Train) {
      player.sessionMob.playerMob.trains -= calculatedAmount
      return
    }
  }

  public canApplyTo(mob: Mob): boolean {
    const calculatedAmount = this.getAmount(mob)
    if (this.costType === CostType.Mv) {
      return mob.mv >= calculatedAmount
    }

    if (this.costType === CostType.Mana) {
      return mob.mana >= calculatedAmount
    }

    if (this.costType === CostType.Delay) {
      return true
    }

    if (this.costType === CostType.Train) {
      return mob.playerMob.trains >= calculatedAmount
    }

    return false
  }

  private getAmount(mob: Mob): number {
    if (typeof this.amount === "function") {
      return this.amount(mob)
    }
    return this.amount
  }
}
