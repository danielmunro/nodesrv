import { allDirections, Direction } from "./constants"
import { getFreeDirection, reverse } from "./direction"
import { newExit } from "./factory"
import { Room } from "./model/room"

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

  it("getFreeDirection should never return a direction which is in use, nor up or down", () => {
    const source = new Room()
    let direction = getFreeDirection(source)
    while (direction) {
      if (source.exits.find((e) => e.direction === direction)) {
        fail("direction already added")
      }
      newExit(direction, source, new Room())
      direction = getFreeDirection(source)
    }
    const NSEW_DIRECTIONS_COUNT = 4
    expect(source.exits.length).toBe(NSEW_DIRECTIONS_COUNT)
  })
})
