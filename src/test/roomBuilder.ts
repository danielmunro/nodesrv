import { Item } from "../item/model/item"
import { Room } from "../room/model/room"
import AbstractBuilder from "./abstractBuilder"
import ServiceBuilder from "../service/serviceBuilder"

export default class RoomBuilder extends AbstractBuilder {
  constructor(public readonly room: Room, serviceBuilder: ServiceBuilder) {
    super(serviceBuilder)
  }

  public withHelmetEq(): Item {
    const equipment = super.withHelmetEq()
    this.room.inventory.addItem(equipment)

    return equipment
  }
}
