import Cost from "./cost"
import {CostType} from "./costType"
import {ConditionMessages} from "../../skill/constants"

export default class ManaCost extends Cost {
  constructor(amount: number) {
    super(CostType.Mana, amount, ConditionMessages.All.NotEnoughMana)
  }
}
