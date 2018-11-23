import { newSkill } from "../skill/factory"
import { Skill } from "../skill/model/skill"
import { SkillType } from "../skill/skillType"
import { newSpell } from "../spell/factory"
import { Spell } from "../spell/model/spell"
import { SpellType } from "../spell/spellType"
import { MESSAGE_MOB_ALREADY_HAS_SPECIALIZATION } from "./constants"
import { Mob } from "./model/mob"
import { Specialization } from "./specialization/specialization"
import Table from "./table"
import MobRepository from "./repository/mob"
import LocationService from "./locationService"

function createSkillFromSkillType(skillType: SkillType): Skill {
  return newSkill(skillType, 1)
}

function createSpellFromSpellType(spellType: SpellType): Spell {
  return newSpell(spellType, 1)
}

export function assignSpecializationToMob(mob: Mob, specialization: Specialization) {
  if (mob.specialization !== undefined) {
    throw Error(MESSAGE_MOB_ALREADY_HAS_SPECIALIZATION)
  }

  mob.specialization = specialization.getSpecializationType()
  mob.attributes.push(specialization.getAttributes())
  mob.skills = [...mob.skills, ...specialization.getSkills().map(createSkillFromSkillType)]
  mob.spells = [...mob.spells, ...specialization.getSpells().map(createSpellFromSpellType)]
}

export default class MobService {
  constructor(
    private readonly mobTable: Table,
    private readonly mobRepository: MobRepository,
    private readonly locationService: LocationService) {}

}
