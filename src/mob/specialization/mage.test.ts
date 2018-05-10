import Mage from "./mage"
import { SpecializationType } from "./specializationType"

describe("mages", () => {
  it("should get mage specialization", () => {
    expect(new Mage().getSpecializationType()).toBe(SpecializationType.Mage)
  })
})
