import { Item } from "../item/model/item"
import { Disposition } from "../mob/disposition"
import { Player } from "../player/model/player"
import { newSkill } from "../skill/factory"
import { Skill } from "../skill/model/skill"
import { SkillType } from "../skill/skillType"
import AbstractBuilder from "./abstractBuilder"

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

  public withDisposition(disposition: Disposition) {
    this.player.sessionMob.disposition = disposition
  }
}
