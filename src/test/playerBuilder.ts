import { Item } from "../item/model/item"
import { Player } from "../player/model/player"
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
}
