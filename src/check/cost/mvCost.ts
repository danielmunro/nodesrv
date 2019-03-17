import {Mob} from "../../mob/model/mob"
import {ConditionMessages} from "../../skill/constants"
import Cost from "./cost"
import {CostType} from "./costType"

export default class MvCost extends Cost {
  constructor(amount: ((mob: Mob) => number) | number) {
    super(CostType.Mv, amount, ConditionMessages.All.NotEnoughMv)
  }
}
