import { Direction } from "../room/constants"
import { newRoom } from "../room/factory"
import { Exploration } from "./exploration"
import { newArena, newInn, newTrail, newWorld } from "./factory"

describe("area factory", () => {
  it("should be able to connect two built structures", async () => {
    expect.assertions(25)
    const innRooms = await newInn(newRoom("test", "test"))
    const trailRooms = await newTrail(innRooms[innRooms.length - 1], Direction.South, 3)
    const allRooms = [...innRooms, ...trailRooms]
    expect(allRooms.length).toBe(8)
    allRooms.forEach((room) => {
      expect(room.exits.length).toBeLessThanOrEqual(6)
      expect(room.exits.length).toBeGreaterThan(0)
      const directions = []
      room.exits.forEach((e) => directions.push(e.direction))
      expect([...new Set(directions)].length).toBe(directions.length)
    })
  })

  it("should be able to create an arena (a matrix of rooms)", async () => {
    const arena = await newArena(newRoom("name", "description"), 3, 3)
    expect(arena.rooms.length).toBe(9)
  })

  it("a world should contain rooms", async () => {
    const world = await newWorld(newRoom("test", "test"))
    expect(world.length).toBeGreaterThanOrEqual(0)
  })

  it("every room in a world should be traversable", async () => {
    // setup
    const rootRoom = newRoom("test", "test")
    const rooms = await newWorld(rootRoom)
    const exploration = new Exploration(rootRoom)

    // when
    exploration.explore()

    // then
    expect(exploration.map.getRoomCount()).toBe(rooms.length)
  })
})
