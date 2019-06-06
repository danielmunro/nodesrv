import {Spell} from "../../spell/model/spell"
import {Target} from "../target"
import MobEvent from "./mobEvent"

export default interface CastEvent extends MobEvent {
  readonly spell: Spell
  readonly roll: number
  readonly target: Target
}
