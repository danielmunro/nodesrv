import { SpecializationType } from "../enum/specializationType"
import Warrior from "./warrior"

describe("warriors", () => {
  it("should get warrior specializationType", () => {
    expect(new Warrior().getSpecializationType()).toBe(SpecializationType.Warrior)
  })
})
