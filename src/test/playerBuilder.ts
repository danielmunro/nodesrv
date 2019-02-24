import {newItem} from "../item/factory"
import {ItemType} from "../item/itemType"
import Container from "../item/model/container"
import {Item} from "../item/model/item"
import {Player} from "../player/model/player"
import {newSkill} from "../skill/factory"
import {Skill} from "../skill/model/skill"
import {SkillType} from "../skill/skillType"

export default class PlayerBuilder {
  constructor(public readonly player: Player) {}

  public withKey(canonicalId): Item {
    const item = newItem(ItemType.Key, "a key", "a key")
    item.canonicalId = canonicalId
    this.player.sessionMob.inventory.addItem(item)
    return item
  }

  public withContainer(): Item {
    const item = newItem(ItemType.Container, "a small leather satchel", "description")
    item.container = new Container()
    this.player.sessionMob.inventory.addItem(item)
    return item
  }

  public withSkill(skillType: SkillType, level: number = 1): Skill {
    const skill = newSkill(skillType, level)
    this.player.sessionMob.skills.push(skill)

    return skill
  }
}
