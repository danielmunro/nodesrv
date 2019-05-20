import { getTestRoom } from "../support/test/room"
import {Direction} from "./enum/direction"
import { newReciprocalExit, newRoom } from "./factory"
import { Room } from "./model/room"

describe("room factory", () => {
  it("should be able to create rooms", () => {
    const name = "a test room"
    const description = "this has a test fixture"
    const room = newRoom(name, description)
    expect(room).toBeInstanceOf(Room)
    expect(room.name).toBe(name)
    expect(room.description).toBe(description)
  })

  it("should be able to create reciprocal exits between rooms", () => {
    const room1 = new Room()
    const room2 = new Room()
    const exits = newReciprocalExit(room1, room2, Direction.East)
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
    expect(() => newReciprocalExit(room, room, Direction.North)).toThrowError()
  })

  it("should not allow connecting two rooms that cannot be connected", () => {
    const room = getTestRoom()
    const r1 = getTestRoom()
    const r2 = getTestRoom()
    const r3 = getTestRoom()
    const r4 = getTestRoom()
    const r5 = getTestRoom()
    const r6 = getTestRoom()
    const unjoinableRoom = getTestRoom()
    newReciprocalExit(room, r1)
    newReciprocalExit(room, r2)
    newReciprocalExit(room, r3)
    newReciprocalExit(room, r4)
    newReciprocalExit(room, r5)
    newReciprocalExit(room, r6)
    expect(() => newReciprocalExit(room, unjoinableRoom)).toThrowError()
  })
})
