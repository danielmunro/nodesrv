import Cost from "../../check/cost/cost"
import MobEvent from "./mobEvent"

export default interface CostEvent extends MobEvent {
  readonly costs: Cost[]
}
