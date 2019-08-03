import {inject, injectable} from "inversify"
import {Types} from "../../../support/types"
import {MobEntity} from "../../entity/mobEntity"
import {newSkill} from "../../skill/factory"
import {SkillType} from "../../skill/skillType"
import {newSpell} from "../../spell/factory"
import {SpellType} from "../../spell/spellType"
import {SpecializationType} from "../enum/specializationType"
import SpecializationLevel from "../specializationLevel"

const initialAbilityLearnedValue = 1

@injectable()
export default class SpecializationService {
  public static getSpecializationTypes(): SpecializationType[] {
    return [
      SpecializationType.Ranger,
      SpecializationType.Warrior,
      SpecializationType.Mage,
      SpecializationType.Cleric,
    ]
  }

  private static addAbility(mob: MobEntity, specializationLevel: SpecializationLevel) {
    if (Object.values(SkillType).includes(specializationLevel.abilityType)) {
      mob.skills.push(newSkill(
        specializationLevel.abilityType as SkillType,
        initialAbilityLearnedValue,
        specializationLevel.minimumLevel))
      return
    }

    if (Object.values(SpellType).includes(specializationLevel.abilityType)) {
      mob.spells.push(newSpell(
        specializationLevel.abilityType as SpellType,
        initialAbilityLearnedValue,
        specializationLevel.minimumLevel))
    }
  }

  constructor(
    @inject(Types.SpecializationLevels) private readonly specializationLevels: SpecializationLevel[]) {}

  public applyAllDefaults(mob: MobEntity) {
    this.specializationLevels.filter(specializationLevel =>
      specializationLevel.specialization === mob.specializationType)
      .forEach(specializationLevel => SpecializationService.addAbility(mob, specializationLevel))
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
    return this.filterAnd(mob, (specializationLevel: SpecializationLevel) =>
      !mob.skills.find(skill => skill.skillType === specializationLevel.abilityType))
  }

  public getUnavailableSkills(mob: MobEntity): SpecializationLevel[] {
    return this.filterAnd(mob, (specializationLevel: SpecializationLevel) =>
      mob.skills.find(skill => skill.skillType === specializationLevel.abilityType))
  }

  private filterAnd(mob: MobEntity, filter: any) {
    return this.filterSpecializationType(mob.specializationType)
      .specializationLevels.filter(specializationLevel =>
      Object.values(SkillType).includes(specializationLevel.abilityType)
      && filter(specializationLevel))
  }
}
