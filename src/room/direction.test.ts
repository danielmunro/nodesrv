import { allDirections, Direction } from "./constants"
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
})