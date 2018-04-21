import { Room } from "../room/model/room"

export class Map {
  private rooms: Room[] = []

  public addRoom(room: Room) {
    this.rooms.push(room)
  }

  public isRoomVisited(room: Room) {
    return this.rooms.find((r) => r === room)
  }

  public getRoomCount() {
    return this.rooms.length
  }
}
