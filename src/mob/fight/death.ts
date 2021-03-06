import { ItemEntity } from "../../item/entity/itemEntity"
import {MaterialType} from "../../item/enum/materialType"
import { newContainer } from "../../item/factory/itemFactory"
import { Messages } from "../../server/observers/constants"
import {pickOne} from "../../support/random/helpers"
import { format } from "../../support/string"
import { MobEntity } from "../entity/mobEntity"
import {getBodyPartItem} from "../race/bodyParts"

const EXPERIENCE_GAIN = 100

export default class Death {
  public readonly corpse: ItemEntity

  constructor(
    public readonly mobKilled: MobEntity,
    public readonly killer?: MobEntity,
    public readonly bounty?: number,
  ) {
    this.corpse = this.createCorpse()
  }

  public calculateKillerExperience(): number {
    if (this.killer && !this.killer.traits.isNpc) {
      return EXPERIENCE_GAIN
    }

    return 0
  }

  public createBodyPart(): ItemEntity {
    return getBodyPartItem(this.mobKilled, pickOne(this.mobKilled.race().bodyParts))
  }

  private createCorpse(): ItemEntity {
    const corpse = newContainer(
      format(Messages.Fight.Corpse.Name, this.mobKilled.name),
      format(Messages.Fight.Corpse.Description, this.mobKilled.name))
    corpse.material = MaterialType.Corpse
    this.mobKilled.inventory.items.forEach(item =>
      corpse.container.getItemFrom(item, this.mobKilled.inventory))
    this.mobKilled.equipped.items.forEach(item =>
      corpse.container.getItemFrom(item, this.mobKilled.equipped))
    corpse.container.gold = this.mobKilled.gold
    this.mobKilled.gold = 0
    return corpse
  }
}
