import ServiceBuilder from "../gameService/serviceBuilder"
import { newContainer } from "../item/factory"
import { Item } from "../item/model/item"
import {Disposition} from "../mob/enum/disposition"
import { Mob } from "../mob/model/mob"
import {Race} from "../mob/race/race"
import { newSkill } from "../skill/factory"
import { Skill } from "../skill/model/skill"
import { SkillType } from "../skill/skillType"
import { Spell } from "../spell/model/spell"
import { SpellType } from "../spell/spellType"
import AbstractBuilder from "./abstractBuilder"

export default class MobBuilder extends AbstractBuilder {
  private equipNextEquipment = false

  constructor(public readonly mob: Mob, serviceBuilder: ServiceBuilder) {
    super(serviceBuilder)
  }

  public equip(): MobBuilder {
    this.equipNextEquipment = true

    return this
  }

  public withRace(race: Race) {
    this.mob.race = race

    return this
  }

  public withHelmetEq(): Item {
    return this.doEquip(super.withHelmetEq())
  }

  public withAxeEq(): Item {
    return this.doEquip(super.withAxeEq())
  }

  public withLevel(level: number) {
    this.mob.level = level

    return this
  }

  public withDisposition(disposition: Disposition) {
    this.mob.disposition = disposition

    return this
  }

  public withSatchelContainer(): Item {
    const item = newContainer("a small leather satchel", "A small leather satchel is here.")
    this.mob.inventory.addItem(item)
    this.serviceBuilder.addItem(item)

    return item
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

  public withGold(gold: number) {
    this.mob.gold = gold
    return this
  }

  private doEquip(equipment: Item) {
    if (this.equipNextEquipment) {
      this.equipNextEquipment = false
      this.mob.equipped.addItem(equipment)
      return equipment
    }

    this.mob.inventory.addItem(equipment)

    return equipment
  }
}
