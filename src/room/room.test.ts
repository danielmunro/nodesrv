import { v4 } from "uuid"
import { allDirections } from "./constants"
import { Exit } from "./exit"
import { Room } from "./room"

describe("a room", () => {
  it("should be able to return its exits", () => {
    const exits = allDirections.map((direction) => new Exit(v4(), direction))
    const room = new Room(
      v4(),
      "room name",
      "room description",
      exits)
    exits.map((exit) => expect(room.getExit(exit.direction).roomID).toEqual(exit.roomID))
  })
})
