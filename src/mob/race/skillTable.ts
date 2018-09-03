import Skill, { default as RaceSkill } from "./skill"
import { Race } from "./race"
import { SkillType } from "../../skill/skillType"

const skillTable = [
  new Skill(Race.Insect, SkillType.Bite),

  // half orc
  new Skill(Race.HalfOrc, SkillType.Bite),
  new Skill(Race.HalfOrc, SkillType.Infravision),
  new Skill(Race.HalfOrc, SkillType.FastHealing),
  new Skill(Race.HalfOrc, SkillType.Spear),

  // halfling
  new Skill(Race.Halfling, SkillType.FastHealing),
  new Skill(Race.Halfling, SkillType.Scan),
  new Skill(Race.Halfling, SkillType.Haggle),
  new Skill(Race.Halfling, SkillType.Dagger),

  // dwarf
  new Skill(Race.Dwarf, SkillType.Sharpen),
  new Skill(Race.Dwarf, SkillType.Infravision),
  new Skill(Race.Dwarf, SkillType.Berserk),
  new Skill(Race.Dwarf, SkillType.Axe),

  // faerie
  new Skill(Race.Faerie, SkillType.Infravision),
  new Skill(Race.Faerie, SkillType.Flying),
  new Skill(Race.Faerie, SkillType.Spellcraft),
  new Skill(Race.Faerie, SkillType.Wand),

  // human
  new Skill(Race.Human, SkillType.Haggle),
  new Skill(Race.Human, SkillType.Lore),
  new Skill(Race.Human, SkillType.Scan),
  new Skill(Race.Human, SkillType.Sword),

  // elf
  new Skill(Race.Elf, SkillType.Infravision),
  new Skill(Race.Elf, SkillType.Sneak),
  new Skill(Race.Elf, SkillType.Lore),
  new Skill(Race.Elf, SkillType.Dagger),

  // giant
  new Skill(Race.Giant, SkillType.Bash),
  new Skill(Race.Giant, SkillType.EnhancedDamage),
  new Skill(Race.Giant, SkillType.Lore),
  new Skill(Race.Giant, SkillType.Mace),

  // kender
  new Skill(Race.Kender, SkillType.Sneak),
  new Skill(Race.Kender, SkillType.Bite),
  new Skill(Race.Kender, SkillType.Haggle),
  new Skill(Race.Kender, SkillType.Dagger),

  // drow
  new Skill(Race.Drow, SkillType.Envenom),
  new Skill(Race.Drow, SkillType.Sneak),
  new Skill(Race.Drow, SkillType.Meditation),
  new Skill(Race.Drow, SkillType.Stave),

  // gnome
  new Skill(Race.Gnome, SkillType.Sharpen),
  new Skill(Race.Gnome, SkillType.Spellcraft),
  new Skill(Race.Gnome, SkillType.Meditation),
  new Skill(Race.Gnome, SkillType.Dagger),
]

export function getRaceSkills(race: Race): Skill[] {
  return skillTable.filter((skill: RaceSkill) => skill.race === race)
}
