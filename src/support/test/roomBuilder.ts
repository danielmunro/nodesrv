import {Item} from "../../item/model/item"
import {Region} from "../../region/model/region"
import DoorEntity from "../../room/entity/doorEntity"
import {ExitEntity} from "../../room/entity/exitEntity"
import { RoomEntity } from "../../room/entity/roomEntity"
import {Direction} from "../../room/enum/direction"

export default class RoomBuilder {
  constructor(public readonly room: RoomEntity) {}

  public setArea(area: string): RoomBuilder {
    this.room.area = area
    return this
  }

  public setRegion(region: Region): RoomBuilder {
    this.room.region = region
    return this
  }

  public setName(name: string): RoomBuilder {
    this.room.name = name
    return this
  }

  public addDoor(door: DoorEntity, direction: Direction = this.room.exits[0].direction): RoomBuilder {
    const exit = this.room.exits.find(e => e.direction === direction) as ExitEntity
    exit.door = door
    return this
  }

  public addItem(item: Item): RoomBuilder {
    this.room.inventory.addItem(item, this.room)
    return this
  }

  public getItemCount(): number {
    return this.room.inventory.items.length
  }

  public get(): RoomEntity {
    return this.room
  }
}
