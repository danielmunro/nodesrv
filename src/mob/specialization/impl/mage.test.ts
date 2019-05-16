import { SpecializationType } from "../enum/specializationType"
import Mage from "./mage"

describe("mages", () => {
  it("should get mage specializationType", () => {
    expect(new Mage().getSpecializationType()).toBe(SpecializationType.Mage)
  })
})
