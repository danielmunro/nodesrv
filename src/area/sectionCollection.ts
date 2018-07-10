import { Room } from "../room/model/room"

export default class SectionCollection {
  public readonly rooms: Room[] = []
  private connectingRoom: Room

  public add(room: Room) {
    this.rooms.push(room)
  }

  public addRooms(rooms: Room[]) {
    this.rooms.push(...rooms)
  }

  public setConnectingRoom(room: Room) {
    this.connectingRoom = room
    if (!this.rooms.includes(room)) {
      this.add(room)
    }
  }

  public getConnectingRoom(): Room {
    return this.connectingRoom
  }
}