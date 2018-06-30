import { Item } from "../item/model/item"
import { newEquipment } from "../item/factory"
import { Equipment } from "../item/equipment"

export default class AbstractBuilder {
  public withTestEquipment(): Item {
    const equipment = newEquipment("a baseball cap", "a baseball cap is here", Equipment.Head)
    equipment.value = 10

    return equipment
  }
}
