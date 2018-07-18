import { Equipment } from "../item/equipment"
import { newEquipment, newFood } from "../item/factory"
import { Item } from "../item/model/item"

export default class AbstractBuilder {
  public withTestEquipment(): Item {
    const equipment = newEquipment("a baseball cap", "a baseball cap is here", Equipment.Head)
    equipment.value = 10

    return equipment
  }

  public withFood(): Item {
    return newFood("a muffin", "a muffin is here")
  }
}
