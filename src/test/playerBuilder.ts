import ServiceBuilder from "../gameService/serviceBuilder"
import {newItem} from "../item/factory"
import {ItemType} from "../item/itemType"
import {Item} from "../item/model/item"
import {Disposition} from "../mob/enum/disposition"
import {Player} from "../player/model/player"
import {newSkill} from "../skill/factory"
import {Skill} from "../skill/model/skill"
import {SkillType} from "../skill/skillType"
import AbstractBuilder from "./abstractBuilder"

export default class PlayerBuilder extends AbstractBuilder {
  private equipNextEquipment = false

  constructor(public readonly player: Player, serviceBuilder: ServiceBuilder) {
    super(serviceBuilder)
  }

  public equip(): PlayerBuilder {
    this.equipNextEquipment = true

    return this
  }

  public withSatchelEq(): Item {
    return this.doEquip(super.withSatchelEq())
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

  public withKey(canonicalId): Item {
    const item = newItem(ItemType.Key, "a key", "a key")
    item.canonicalId = canonicalId
    this.player.sessionMob.inventory.addItem(item)
    return item
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
      this.player.sessionMob.equipped.addItem(equipment)
      return equipment
    }

    this.player.sessionMob.inventory.addItem(equipment)

    return equipment
  }
}
