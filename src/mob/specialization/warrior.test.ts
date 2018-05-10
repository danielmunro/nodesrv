import { SpecializationType } from "./specializationType"
import Warrior from "./warrior"

describe("warriors", () => {
  it("should get warrior specialization", () => {
    expect(new Warrior().getSpecializationType()).toBe(SpecializationType.Warrior)
  })
})
