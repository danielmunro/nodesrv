import { Room } from "../room/model/room"
import { Map } from "./map"

export class Exploration {
  public readonly map: Map = new Map()
  private currentRoom: Room

  constructor(currentRoom: Room) {
    this.currentRoom = currentRoom
  }

  public explore(room: Room = this.currentRoom) {
    this.map.addRoom(room)
    room.exits.forEach((e) => {
      if (!this.map.isRoomVisited(e.destination)) {
        this.explore(e.destination)
      }
    })
  }
}
