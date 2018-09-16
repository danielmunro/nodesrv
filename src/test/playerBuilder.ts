import { DamageType } from "../damage/damageType"
import { newWeapon } from "../item/factory"
import { Item } from "../item/model/item"
import { WeaponType } from "../item/weaponType"
import { Disposition } from "../mob/disposition"
import { Player } from "../player/model/player"
import { newSkill } from "../skill/factory"
import { Skill } from "../skill/model/skill"
import { SkillType } from "../skill/skillType"
import AbstractBuilder from "./abstractBuilder"

export default class PlayerBuilder extends AbstractBuilder {
  private equipNextEquipment = false

  constructor(public readonly player: Player) {
    super()
  }

  public equip(): PlayerBuilder {
    this.equipNextEquipment = true

    return this
  }

  public withHelmetEq(): Item {
    return this.doEquip(super.withHelmetEq())
  }

  public withAxeEq(): Item {
    return this.doEquip(super.withAxeEq())
  }

  public withFood(): Item {
    const food = super.withFood()
    this.player.sessionMob.inventory.addItem(food)

    return food
  }

  public withSkill(skillType: SkillType, level: number = 1): Skill {
    const skill = newSkill(skillType, level)
    this.player.sessionMob.skills.push(skill)

    return skill
  }

  public withDisposition(disposition: Disposition) {
    this.player.sessionMob.disposition = disposition
  }

  private doEquip(equipment) {
    if (this.equipNextEquipment) {
      this.equipNextEquipment = false
      this.player.sessionMob.equipped.inventory.addItem(equipment)
      return equipment
    }

    this.player.sessionMob.inventory.addItem(equipment)

    return equipment
  }
}
