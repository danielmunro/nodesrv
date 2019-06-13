import Event from "../../event/event"
import {MobEntity} from "../../mob/entity/mobEntity"
import {Spell} from "../../spell/model/spell"
import {Skill} from "../model/skill"

export default interface SkillEvent extends Event {
  readonly skill: Skill | Spell
  readonly mob: MobEntity
  readonly rollResult: boolean
}
