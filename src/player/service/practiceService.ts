import {MAX_MOB_LEVEL} from "../../mob/constants"
import {MobEntity} from "../../mob/entity/mobEntity"
import {SkillEntity} from "../../skill/entity/skillEntity"
import {SpellEntity} from "../../spell/entity/spellEntity"

const LENGTH = 24

export default class PracticeService {
  private static createSpace(ability: string): string {
    const abilityLength = ability.length
    const spaces = LENGTH - abilityLength
    return ability + " ".repeat(spaces)
  }

  private static getPracticedLevel(mob: MobEntity, ability: SkillEntity | SpellEntity) {
    return mob.level >= ability.levelObtained ? ability.level : "NA"
  }

  private static getType(ability: SkillEntity | SpellEntity) {
    if (ability instanceof SkillEntity) {
      return ability.skillType
    }

    return ability.spellType
  }

  public generateOutputStatus(mob: MobEntity) {
    return PracticeService.createSpace("skill") + "current practiced level\n" + this.iterateLevel(mob, 1)
  }

  private iterateLevel(mob: MobEntity, level: number, buf: string = ""): string {
    const levelAbilities = [
      ...mob.skills.filter(skill => skill.levelObtained === level),
      ...mob.spells.filter(spell => spell.levelObtained === level),
    ]

    if (levelAbilities.length) {
      buf += `\nlevel ${level}\n${this.reduce(mob, levelAbilities)}`
    }

    if (level < MAX_MOB_LEVEL) {
      return this.iterateLevel(mob, level + 1, buf)
    }

    return buf
  }

  private reduce(mob: MobEntity, abilities: any) {
    return abilities.reduce((previous: string, current: SkillEntity | SpellEntity) =>
      previous + PracticeService.createSpace(PracticeService.getType(current)) +
      PracticeService.getPracticedLevel(mob, current) + "\n", "")
  }
}
