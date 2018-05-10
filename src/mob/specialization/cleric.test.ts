import Cleric from "./cleric"
import { SpecializationType } from "./specializationType"

describe("clerics", () => {
  it("should get cleric specialization", () => {
    expect(new Cleric().getSpecializationType()).toBe(SpecializationType.Cleric)
  })
})
