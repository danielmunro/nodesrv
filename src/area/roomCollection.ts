import roll from "../dice/dice"
import { Room } from "../room/model/room"
import { SectionType } from "./sectionType"

export default class RoomCollection {
  private collection = {}

  public add(sectionType: SectionType, room: Room) {
    if (!this.collection[sectionType]) {
      this.collection[sectionType] = []
    }

    this.collection[sectionType].push(room)
  }

  public getRandomBySectionType(sectionType: SectionType): Room {
    const rooms = this.collection[sectionType]
    const room = rooms[roll(1, rooms.length) - 1]

    return room.copy()
  }
}
