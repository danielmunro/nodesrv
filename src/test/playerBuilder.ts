import { Equipment } from "../item/equipment"
import { newEquipment } from "../item/factory"
import { Item } from "../item/model/item"
import { Player } from "../player/model/player"

export default class PlayerBuilder {
  constructor(
    public readonly player: Player,
  ) {}

  public withTestEquipment(): Item {
    const equipment = newEquipment("a baseball cap", "a baseball cap is here", Equipment.Head)
    equipment.value = 10
    this.player.sessionMob.inventory.addItem(equipment)

    return equipment
  }
}
