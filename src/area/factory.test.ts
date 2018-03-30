import { getConnection } from "../db/connection"
import { Direction } from "../room/constants"
import { newRoom } from "../room/factory"
import { newInn, newTrail } from "./factory"

describe("area factory", () => {
  it("should be able to connect two built structures", () => {
    const root = newRoom("test", "test")
    expect.assertions(25)

    return getConnection().then(() => newInn(root).then((innRooms) =>
      newTrail(innRooms[innRooms.length - 1], Direction.South, 3)
      .then((trailRooms) => {
        const allRooms = [...innRooms, ...trailRooms]
        expect(allRooms.length).toBe(8)
        allRooms.forEach((room) => {
          expect(room.exits.length).toBeLessThanOrEqual(6)
          expect(room.exits.length).toBeGreaterThan(0)
          const directions = []
          room.exits.forEach((e) => directions.push(e.direction))
          expect([...new Set(directions)].length).toBe(directions.length)
        })
      })))
  })
})
