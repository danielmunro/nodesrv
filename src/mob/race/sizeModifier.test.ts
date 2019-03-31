import { RaceType } from "./raceType"
import { getSizeModifier } from "./sizeModifier"

describe("size modifier", () => {
  it("should assign the expected modifier", () => {
    expect(getSizeModifier(RaceType.Faerie, 1, 2)).toBe(1)
    expect(getSizeModifier(RaceType.HalfOrc, 1, 2)).toBe(2)
    expect(getSizeModifier(RaceType.Human, 1, 2)).toBe(0)
  })
})
