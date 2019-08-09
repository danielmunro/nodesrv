import { allDirections, cardinalDirections} from "../constants"
import {Direction} from "../enum/direction"
import {createRoom, newExit} from "../factory/roomFactory"
import { reverse } from "./direction"

describe("direction", () => {
  it("should be able to get the reverse direction", () => {
    allDirections.forEach((direction) => expect(reverse(direction)).toBeTruthy())
    expect(reverse(Direction.North)).toBe(Direction.South)
    expect(reverse(Direction.South)).toBe(Direction.North)
    expect(reverse(Direction.East)).toBe(Direction.West)
    expect(reverse(Direction.West)).toBe(Direction.East)
    expect(reverse(Direction.Up)).toBe(Direction.Down)
    expect(reverse(Direction.Down)).toBe(Direction.Up)
  })

  it("getFreeDirection should never return a direction which has in use, nor up or down", () => {
    const source = createRoom()
    let direction = source.getUnusedDirection()
    while (direction) {
      if (source.exits.find((e) => e.direction === direction)) {
        fail("direction already added")
      }
      newExit(direction, source, createRoom())
      direction = source.getUnusedDirection()
    }
    const NSEW_DIRECTIONS_COUNT = 4
    expect(source.exits.length).toBe(NSEW_DIRECTIONS_COUNT)
  })

  it("getFreeReciprocalDirection should consider the destination room when finding a random direction", () => {
    // setup
    const source = createRoom()
    const destination = createRoom()
    // fill up the destination room exits
    newExit(Direction.North, destination, createRoom())
    newExit(Direction.South, destination, createRoom())
    newExit(Direction.East, destination, createRoom())

    // expect
    expect(source.getUnusedReciprocalDirection(destination)).toBe(Direction.East)
  })

  it("getFreeReciprocalDirection should not make impossible connections", () => {
    // setup
    const source = createRoom()
    const destination = createRoom()
    cardinalDirections.forEach((d) => newExit(d, destination, createRoom()))

    // expect
    expect(source.getUnusedReciprocalDirection(destination)).toBeUndefined()
  })
})
