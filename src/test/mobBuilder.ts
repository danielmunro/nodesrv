import { newContainer } from "../item/factory"
import { Item } from "../item/model/item"
import { Mob } from "../mob/model/mob"
import ServiceBuilder from "../service/serviceBuilder"
import { newSkill } from "../skill/factory"
import { Skill } from "../skill/model/skill"
import { SkillType } from "../skill/skillType"
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
