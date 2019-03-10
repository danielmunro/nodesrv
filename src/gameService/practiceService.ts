import {MAX_MOB_LEVEL} from "../mob/constants"
import {Mob} from "../mob/model/mob"
import {Skill} from "../skill/model/skill"
import {Spell} from "../spell/model/spell"

const LENGTH = 24

export default class PracticeService {
  private static createSpace(ability: string): string {
    const abilityLength = ability.length
    const spaces = LENGTH - abilityLength
    return ability + " ".repeat(spaces)
  }

  private static getPracticedLevel(mob: Mob, ability: Skill | Spell) {
    return mob.level >= ability.levelObtained ? ability.level : "NA"
  }

  public generateOutputStatus(mob: Mob) {
    return PracticeService.createSpace("skill") + "current practiced level\n" + this.iterateLevel(mob, 1)
  }

  private iterateLevel(mob: Mob, level: number, buf: string = ""): string {
    const skills = mob.skills.filter(skill => skill.levelObtained === level)
    const spells = mob.spells.filter(spell => spell.levelObtained === level)

    if (skills.length || spells.length) {
      buf += `\nlevel ${level}\n`
        + skills.reduce((previous, current) =>
        previous + PracticeService.createSpace(current.skillType) +
          PracticeService.getPracticedLevel(mob, current) + "\n", "")
        + spells.reduce((previous, current) =>
        previous + PracticeService.createSpace(current.spellType) +
          PracticeService.getPracticedLevel(mob, current) + "\n", "")
    }

    if (level < MAX_MOB_LEVEL) {
      return this.iterateLevel(mob, level + 1, buf)
    }

    return buf
  }
}
