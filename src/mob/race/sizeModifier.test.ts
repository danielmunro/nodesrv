import { Race } from "./race"
import { getSizeModifier } from "./sizeModifier"

describe("size modifier", () => {
  it("should assign the expected modifier", () => {
    expect(getSizeModifier(Race.Faerie, 1, 2)).toBe(1)
    expect(getSizeModifier(Race.HalfOrc, 1, 2)).toBe(2)
    expect(getSizeModifier(Race.Human, 1, 2)).toBe(0)
  })
})
