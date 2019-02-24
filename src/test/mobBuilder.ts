import {Disposition} from "../mob/enum/disposition"
import { Mob } from "../mob/model/mob"
import Shop from "../mob/model/shop"
import {Race} from "../mob/race/race"
import { newSkill } from "../skill/factory"
import { Skill } from "../skill/model/skill"
import { SkillType } from "../skill/skillType"
import { Spell } from "../spell/model/spell"
import { SpellType } from "../spell/spellType"

export default class MobBuilder {
  constructor(public readonly mob: Mob) {}

  public asTrainer(): MobBuilder {
    this.mob.traits.trainer = true
    return this
  }

  public asPractice(): MobBuilder {
    this.mob.traits.practice = true
    return this
  }

  public asMerchant(): MobBuilder {
    this.mob.shop = new Shop()
    return this
  }

  public withRace(race: Race) {
    this.mob.race = race

    return this
  }

  public withMv(amount: number): MobBuilder {
    this.mob.vitals.mv = amount
    return this
  }

  public withLevel(level: number): MobBuilder {
    this.mob.level = level

    return this
  }

  public withDisposition(disposition: Disposition): MobBuilder {
    this.mob.disposition = disposition

    return this
  }

  public withSkill(skillType: SkillType, level: number = 1): Skill {
    const skill = newSkill(skillType, level)
    this.mob.skills.push(skill)

    return skill
  }

  public withSpell(spellType: SpellType, level: number = 1): Spell {
    const spell = new Spell()
    spell.spellType = spellType
    spell.level = level
    this.mob.spells.push(spell)

    return spell
  }

  public withGold(gold: number): MobBuilder {
    this.mob.gold = gold
    return this
  }
}
