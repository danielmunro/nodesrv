import { Room } from "../room/model/room"
import { Arena } from "./arena"

export default class SectionCollection {
  public readonly rooms: Room[] = []
  private connectingRoom: Room

  constructor(public readonly arena: Arena = null) {}

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
    if (this.arena) {
      return this.arena.getRandomEdge()
    }

    return this.connectingRoom
  }
}
