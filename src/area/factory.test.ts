import { getConnection } from "../db/connection"
import { Direction } from "../room/constants"
import { newRoom } from "../room/factory"
import { Exploration } from "./exploration"
import { newArena, newInn, newTrail, newWorld } from "./factory"

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

  it("should be able to create an arena (a matrix of rooms)", () => {
    expect.assertions(1)
    return newArena(newRoom("name", "description"), 3, 3)
      .then((rooms) => {
        expect(rooms.length).toBe(9)
      })
  })

  it("a world should contain rooms", () => {
    const rootRoom = newRoom("test", "test")
    expect.assertions(1)

    return newWorld(rootRoom).then((world) =>
      expect(world.length).toBeGreaterThanOrEqual(0))
  })

  it("every room in a world should be traversable", () => {
    const rootRoom = newRoom("test", "test")
    expect.assertions(1)

    return newWorld(rootRoom)
      .then((rooms) => {
        const exploration = new Exploration(rootRoom)
        exploration.explore()
        expect(rooms.length).toBe(exploration.map.getRoomCount())
      })
  })
})
