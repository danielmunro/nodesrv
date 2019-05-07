import {Item} from "../../item/model/item"
import {Region} from "../../region/model/region"
import {Direction} from "../../room/constants"
import Door from "../../room/model/door"
import {Exit} from "../../room/model/exit"
import { Room } from "../../room/model/room"

export default class RoomBuilder {
  constructor(public readonly room: Room) {}

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

  public addDoor(door: Door, direction: Direction = this.room.exits[0].direction): RoomBuilder {
    const exit = this.room.exits.find(e => e.direction === direction) as Exit
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

  public get(): Room {
    return this.room
  }
}
