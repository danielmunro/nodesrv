import {MobEntity} from "../../mob/entity/mobEntity"
import {ConditionMessages} from "../../skill/constants"
import Cost from "./cost"
import {CostType} from "./costType"

export default class MvCost extends Cost {
  constructor(amount: ((mob: MobEntity) => number) | number) {
    super(CostType.Mv, amount, ConditionMessages.All.NotEnoughMv)
  }
}
