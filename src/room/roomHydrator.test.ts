import { Room } from "./room"
import { v4 } from "uuid"
import { Exit } from "./exit"
import { Direction } from "./constants"
import { saveRooms } from "./model"
import { findRoom } from "./repository"

describe("room hydrator", () => {
  it("should be able to hydrate an identical copy room", () => {
    const id1 = v4()
    const id2 = v4()
    const initialRoom1 = new Room(id1, "name", "description", [new Exit(id2, Direction.South)])
    const initialRoom2 = new Room(id2, "name", "description", [new Exit(id1, Direction.North)])

    expect.assertions(2)
    return saveRooms([initialRoom1, initialRoom2])
      .then(() => Promise.all([
        findRoom(id1)
          .then((hydratedRoom) => expect(hydratedRoom).toEqual(initialRoom1)),
        findRoom(id2)
          .then((hydratedRoom) => expect(hydratedRoom).toEqual(initialRoom2))]))
  })
})