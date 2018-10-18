import ItemTable from "../item/itemTable"
import { Item } from "../item/model/item"
import { Mob } from "../mob/model/mob"
import { default as MobTable } from "../mob/table"
import { Room } from "../room/model/room"
import { default as RoomTable } from "../room/table"
import Service from "./service"

export default class ServiceBuilder {
  constructor(private rooms: Room[] = [], private mobs: Mob[] = [], private items: Item[] = []) {}

  public addRoom(room: Room): void {
    this.rooms.push(room)
  }

  public addMob(mob: Mob): void {
    this.mobs.push(mob)
  }

  public addItem(item: Item): void {
    this.items.push(item)
  }

  public async createService(): Promise<Service> {
    return Service.new(
      RoomTable.new(this.rooms),
      new MobTable(this.mobs),
      new ItemTable(this.items),
    )
  }
}
