import { SkillType } from "../../skill/skillType"
import { RaceType } from "./raceType"
import Skill, { default as RaceSkill } from "./skill"

const skillTable = [
  new Skill(RaceType.Insect, SkillType.Bite),

  // half orc
  new Skill(RaceType.HalfOrc, SkillType.Bite),
  new Skill(RaceType.HalfOrc, SkillType.Infravision),
  new Skill(RaceType.HalfOrc, SkillType.FastHealing),
  new Skill(RaceType.HalfOrc, SkillType.Spear),

  // halfling
  new Skill(RaceType.Halfling, SkillType.FastHealing),
  new Skill(RaceType.Halfling, SkillType.Scan),
  new Skill(RaceType.Halfling, SkillType.Haggle),
  new Skill(RaceType.Halfling, SkillType.Dagger),

  // dwarf
  new Skill(RaceType.Dwarf, SkillType.Sharpen),
  new Skill(RaceType.Dwarf, SkillType.Infravision),
  new Skill(RaceType.Dwarf, SkillType.Berserk),
  new Skill(RaceType.Dwarf, SkillType.Axe),

  // faerie
  new Skill(RaceType.Faerie, SkillType.Infravision),
  new Skill(RaceType.Faerie, SkillType.Flying),
  new Skill(RaceType.Faerie, SkillType.Spellcraft),
  new Skill(RaceType.Faerie, SkillType.Wand),

  // human
  new Skill(RaceType.Human, SkillType.Haggle),
  new Skill(RaceType.Human, SkillType.Lore),
  new Skill(RaceType.Human, SkillType.Scan),
  new Skill(RaceType.Human, SkillType.Sword),

  // elf
  new Skill(RaceType.Elf, SkillType.Infravision),
  new Skill(RaceType.Elf, SkillType.Sneak),
  new Skill(RaceType.Elf, SkillType.Lore),
  new Skill(RaceType.Elf, SkillType.Dagger),

  // giant
  new Skill(RaceType.Giant, SkillType.Bash),
  new Skill(RaceType.Giant, SkillType.EnhancedDamage),
  new Skill(RaceType.Giant, SkillType.Lore),
  new Skill(RaceType.Giant, SkillType.Mace),

  // kender
  new Skill(RaceType.Kender, SkillType.Sneak),
  new Skill(RaceType.Kender, SkillType.Bite),
  new Skill(RaceType.Kender, SkillType.Haggle),
  new Skill(RaceType.Kender, SkillType.Dagger),

  // drow
  new Skill(RaceType.Drow, SkillType.Envenom),
  new Skill(RaceType.Drow, SkillType.Sneak),
  new Skill(RaceType.Drow, SkillType.Meditation),
  new Skill(RaceType.Drow, SkillType.Stave),

  // gnome
  new Skill(RaceType.Gnome, SkillType.Sharpen),
  new Skill(RaceType.Gnome, SkillType.Spellcraft),
  new Skill(RaceType.Gnome, SkillType.Meditation),
  new Skill(RaceType.Gnome, SkillType.Dagger),
]

export function getRaceSkills(race: RaceType): Skill[] {
  return skillTable.filter((skill: RaceSkill) => skill.race === race)
}
