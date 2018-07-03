import { Direction } from "../room/constants"
import { newRoom } from "../room/factory"
import { newInn } from "./builder/forest/inn"
import { newTrail } from "./builder/forest/trail"
import { Exploration } from "./exploration"
import { newArena, newWorld } from "./factory"

describe("area factory", () => {
  it("should be able to connect two built structures", async () => {
    // given
    const innRooms = await newInn(newRoom("outside connection", "test"))
    const trailRooms = await newTrail(innRooms[innRooms.length - 1], Direction.South, 3)
    const allRooms = [...innRooms, ...trailRooms]

    // expect
    expect(allRooms.length).toBe(10)
    allRooms.forEach((room) => {
      expect(room.exits.length).toBeLessThanOrEqual(6)
      expect(room.exits.length).toBeGreaterThan(0)
    })
  })

  it("should be able to create an arena (a matrix of rooms)", async () => {
    // given
    const arena = await newArena(newRoom("name", "description"), 3, 3)

    // expect
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
    expect(exploration.map.getRoomCount()).toBe(rooms.length - 1)
  })
})
