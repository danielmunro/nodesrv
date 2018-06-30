import { Room } from "../room/model/room"
import AbstractBuilder from "./abstractBuilder"
import { Item } from "../item/model/item"

export default class RoomBuilder extends AbstractBuilder {
  constructor(public readonly room: Room) {
    super()
  }

  public withTestEquipment(): Item {
    const equipment = super.withTestEquipment()
    this.room.inventory.addItem(equipment)

    return equipment
  }
}
