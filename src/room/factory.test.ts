import { Mob } from "../mob/model/mob"
import { Direction } from "./constants"
import { newReciprocalExit, newRoom } from "./factory"
import { Room } from "./model/room"
import { getTestMob } from "../test/mob"

describe("room factory", () => {
  it("should be able to create rooms", () => {
    const name = "a test room"
    const description = "this is a test fixture"
    const mobs = [
      getTestMob(),
    ]
    const room = newRoom(name, description, mobs)
    expect(room).toBeInstanceOf(Room)
    expect(room.name).toBe(name)
    expect(room.description).toBe(description)
    expect(room.mobs).toBe(mobs)
    expect(newRoom("name", "description").mobs).toEqual([])
  })

  it("should be able to create reciprocal exits between rooms", () => {
    const room1 = new Room()
    const room2 = new Room()
    const exits = newReciprocalExit(Direction.East, room1, room2)
    expect(exits).toHaveLength(2)
    const [exit1, exit2] = exits
    expect(exit1.direction).toBe(Direction.East)
    expect(exit2.direction).toBe(Direction.West)
    expect(exit1.source).toBe(room1)
    expect(exit1.destination).toBe(room2)
    expect(exit2.source).toBe(room2)
    expect(exit2.destination).toBe(room1)
  })

  it("should not be able to connect a room to itself", () => {
    const room = new Room()
    expect(() => newReciprocalExit(Direction.North, room, room)).toThrowError()
  })
})
