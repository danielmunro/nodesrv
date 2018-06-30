import { Item } from "../item/model/item"
import { Player } from "../player/model/player"
import AbstractBuilder from "./abstractBuilder"
import { Skill } from "../skill/model/skill"
import { SkillType } from "../skill/skillType"
import { newSkill } from "../skill/factory"

export default class PlayerBuilder extends AbstractBuilder {
  constructor(public readonly player: Player) {
    super()
  }

  public withTestEquipment(): Item {
    const equipment = super.withTestEquipment()
    this.player.sessionMob.inventory.addItem(equipment)

    return equipment
  }

  public withSkill(skillType: SkillType, level: number = 1): Skill {
    const skill = newSkill(skillType, level)
    this.player.sessionMob.skills.push(skill)

    return skill
  }
}
