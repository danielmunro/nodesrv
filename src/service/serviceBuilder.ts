import { Room } from "../room/model/room"
import { Mob } from "../mob/model/mob"
import { Item } from "../item/model/item"
import Service from "./service"
import { default as RoomTable } from "../room/table"
import { default as MobTable } from "../mob/table"
import ItemTable from "../item/itemTable"

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
      new RoomTable(this.rooms),
      new MobTable(this.mobs),
      new ItemTable(this.items),
    )
  }
}
