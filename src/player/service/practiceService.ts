import {MAX_MOB_LEVEL} from "../../mob/constants"
import {MobEntity} from "../../mob/entity/mobEntity"
import {Skill} from "../../skill/model/skill"
import {Spell} from "../../spell/model/spell"

const LENGTH = 24

export default class PracticeService {
  private static createSpace(ability: string): string {
    const abilityLength = ability.length
    const spaces = LENGTH - abilityLength
    return ability + " ".repeat(spaces)
  }

  private static getPracticedLevel(mob: MobEntity, ability: Skill | Spell) {
    return mob.level >= ability.levelObtained ? ability.level : "NA"
  }

  private static getType(ability: Skill | Spell) {
    if (ability instanceof Skill) {
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
    return abilities.reduce((previous: string, current: Skill | Spell) =>
      previous + PracticeService.createSpace(PracticeService.getType(current)) +
      PracticeService.getPracticedLevel(mob, current) + "\n", "")
  }
}
