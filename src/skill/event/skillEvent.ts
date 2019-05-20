import Event from "../../event/event"
import {Mob} from "../../mob/model/mob"
import {Spell} from "../../spell/model/spell"
import {Skill} from "../model/skill"

export default interface SkillEvent extends Event {
  readonly skill: Skill | Spell
  readonly mob: Mob
  readonly rollResult: boolean
}
