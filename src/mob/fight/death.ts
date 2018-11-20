import { Mob } from "../model/mob"
import { Room } from "../../room/model/room"
import { Item } from "../../item/model/item"
import { newContainer } from "../../item/factory"
import { format } from "../../support/string"
import { Messages } from "../../server/observers/constants"
import { getBodyPartItem, getRandomBodyPartForRace } from "../race/bodyParts"

const EXPERIENCE_GAIN = 100

export default class Death {
  constructor(
    public readonly mobKilled: Mob,
    public readonly room: Room,
    public readonly killer: Mob = null,
  ) {}

  public calculateKillerExperience(): number {
    if (this.killer && this.killer.isPlayer) {
      return EXPERIENCE_GAIN
    }

    return 0
  }

  public createCorpse(): Item {
    const corpse = newContainer(
      format(Messages.Fight.Corpse.Name, this.mobKilled.name),
      format(Messages.Fight.Corpse.Description, this.mobKilled.name))
    this.mobKilled.inventory.items.forEach(item =>
      corpse.container.getItemFrom(item, this.mobKilled.inventory))
    this.mobKilled.equipped.inventory.items.forEach(item =>
      corpse.container.getItemFrom(item, this.mobKilled.equipped.inventory))

    return corpse
  }

  public createBodyPart() {
    return getBodyPartItem(this.mobKilled, getRandomBodyPartForRace(this.mobKilled.race))
  }
}
