import {ConditionMessages} from "../../mob/skill/constants"
import Cost from "./cost"
import {CostType} from "./costType"

export default class ManaCost extends Cost {
  constructor(amount: number) {
    super(CostType.Mana, amount, ConditionMessages.All.NotEnoughMana)
  }
}
