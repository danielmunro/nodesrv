import Event from "../../../event/interface/event"
import {MobEntity} from "../../entity/mobEntity"
import {SpellEntity} from "../../spell/entity/spellEntity"
import {SkillEntity} from "../entity/skillEntity"

export default interface SkillEvent extends Event {
  readonly skill: SkillEntity | SpellEntity
  readonly mob: MobEntity
  readonly rollResult: boolean
}
