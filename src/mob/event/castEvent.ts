import {SpellEntity} from "../../spell/entity/spellEntity"
import {Target} from "../target"
import MobEvent from "./mobEvent"

export default interface CastEvent extends MobEvent {
  readonly spell: SpellEntity
  readonly roll: number
  readonly target: Target
}
