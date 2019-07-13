import {Target} from "../../types/target"
import {SpellEntity} from "../spell/entity/spellEntity"
import MobEvent from "./mobEvent"

export default interface CastEvent extends MobEvent {
  readonly spell: SpellEntity
  readonly roll: number
  readonly target: Target
}
