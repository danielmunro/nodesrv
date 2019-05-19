import Cost from "../../check/cost/cost"
import Event from "../../event/event"
import {Mob} from "../model/mob"

export default interface CostEvent extends Event {
  readonly mob: Mob
  readonly costs: Cost[]
}
