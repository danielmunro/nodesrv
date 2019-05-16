import { SpecializationType } from "../enum/specializationType"
import Cleric from "./cleric"

describe("clerics", () => {
  it("should get cleric specializationType", () => {
    expect(new Cleric().getSpecializationType()).toBe(SpecializationType.Cleric)
  })
})
