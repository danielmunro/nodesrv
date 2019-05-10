import {inject, injectable} from "inversify"
import {newSkill} from "../../skill/factory"
import {SkillType} from "../../skill/skillType"
import {newSpell} from "../../spell/factory"
import {SpellType} from "../../spell/spellType"
import {Types} from "../../support/types"
import {Mob} from "../model/mob"
import SpecializationLevel from "./specializationLevel"

@injectable()
export default class SpecializationService {
  constructor(
    @inject(Types.SpecializationLevels) private readonly specializationLevels: SpecializationLevel[]) {}

  public applyAllDefaults(mob: Mob) {
    this.specializationLevels.filter(specializationLevel =>
      specializationLevel.specialization === mob.specializationType)
      .forEach(specializationLevel => {
        if (Object.values(SkillType).includes(specializationLevel.abilityType)) {
          mob.skills.push(newSkill(
            specializationLevel.abilityType as SkillType,
            1,
            specializationLevel.minimumLevel))
        } else if (Object.values(SpellType).includes(specializationLevel.abilityType)) {
          mob.spells.push(newSpell(
            specializationLevel.abilityType as SpellType,
            1,
            specializationLevel.minimumLevel))
        }
      })
  }
}
