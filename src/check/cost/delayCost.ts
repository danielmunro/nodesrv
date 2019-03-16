import Cost from "./cost"
import {CostType} from "./costType"

export default class DelayCost extends Cost {
  constructor(amount: number) {
    super(CostType.Delay, amount)
  }
}
