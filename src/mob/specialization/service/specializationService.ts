import {inject, injectable} from "inversify"
import {newSkill} from "../../skill/factory"
import {SkillType} from "../../skill/skillType"
import {newSpell} from "../../spell/factory"
import {SpellType} from "../../spell/spellType"
import {Types} from "../../../support/types"
import {MobEntity} from "../../entity/mobEntity"
import {SpecializationType} from "../enum/specializationType"
import SpecializationLevel from "../specializationLevel"

@injectable()
export default class SpecializationService {
  constructor(
    @inject(Types.SpecializationLevels) private readonly specializationLevels: SpecializationLevel[]) {}

  public applyAllDefaults(mob: MobEntity) {
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

  public getSpecializationLevel(abilityType: SkillType | SpellType): SpecializationLevel {
    return this.specializationLevels
      .find(specializationLevel =>
        specializationLevel.abilityType === abilityType) as SpecializationLevel
  }

  public filterSpecializationType(specializationType: SpecializationType): SpecializationService {
    return new SpecializationService(this.specializationLevels.filter(specializationLevel =>
      specializationLevel.specialization === specializationType
      || specializationLevel.specialization === SpecializationType.Any))
  }

  public getAvailableSkills(mob: MobEntity): SpecializationLevel[] {
    return this.filterSpecializationType(mob.specializationType)
      .specializationLevels.filter(specializationLevel =>
        Object.values(SkillType).includes(specializationLevel.abilityType)
        && !mob.playerMob.customizations.includes(specializationLevel))
  }

  public getUnavailableSkills(mob: MobEntity): SpecializationLevel[] {
    return this.filterSpecializationType(mob.specializationType)
      .specializationLevels.filter(specializationLevel =>
        Object.values(SkillType).includes(specializationLevel.abilityType)
        && !mob.playerMob.customizations.includes(specializationLevel))
  }
}
