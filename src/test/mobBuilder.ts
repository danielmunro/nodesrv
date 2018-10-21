import { newContainer } from "../item/factory"
import { Item } from "../item/model/item"
import { Mob } from "../mob/model/mob"
import ServiceBuilder from "../service/serviceBuilder"
import { newSkill } from "../skill/factory"
import { Skill } from "../skill/model/skill"
import { SkillType } from "../skill/skillType"
import AbstractBuilder from "./abstractBuilder"
import { SpellType } from "../spell/spellType"
import { Spell } from "../spell/model/spell"
import { newSpell } from "../spell/factory"

export default class MobBuilder extends AbstractBuilder {
  private equipNextEquipment = false

  constructor(public readonly mob: Mob, serviceBuilder: ServiceBuilder) {
    super(serviceBuilder)
  }

  public equip(): MobBuilder {
    this.equipNextEquipment = true

    return this
  }

  public atLevel(level: number) {
    this.mob.level = level

    return this
  }

  public withHelmetEq(): Item {
    return this.doEquip(super.withHelmetEq())
  }

  public withAxeEq(): Item {
    return this.doEquip(super.withAxeEq())
  }

  public withMaceEq(): Item {
    return this.doEquip(super.withMaceEq())
  }

  public withLevel(level: number) {
    this.mob.level = level

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
    const spell = newSpell(spellType, level)
    this.mob.spells.push(spell)

    return spell
  }

  private doEquip(equipment) {
    if (this.equipNextEquipment) {
      this.equipNextEquipment = false
      this.mob.equipped.inventory.addItem(equipment)
      return equipment
    }

    this.mob.inventory.addItem(equipment)

    return equipment
  }
}
