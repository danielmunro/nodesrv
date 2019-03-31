import { createSpecializationFromType } from "./factory"
import Cleric from "./impl/cleric"
import Mage from "./impl/mage"
import Ranger from "./impl/ranger"
import Warrior from "./impl/warrior"
import { SpecializationType } from "./specializationType"

describe("specializationType factory", () => {
  it("should be able to create a cleric", () => {
    expect(createSpecializationFromType(SpecializationType.Cleric)).toBeInstanceOf(Cleric)
  })

  it("should be able to create a mage", () => {
    expect(createSpecializationFromType(SpecializationType.Mage)).toBeInstanceOf(Mage)
  })

  it("should be able to create a ranger", () => {
    expect(createSpecializationFromType(SpecializationType.Ranger)).toBeInstanceOf(Ranger)
  })

  it("should be able to create a warrior", () => {
    expect(createSpecializationFromType(SpecializationType.Warrior)).toBeInstanceOf(Warrior)
  })

  it("should throw an error if the specializationType type is unknown", () => {
    expect(() => createSpecializationFromType(SpecializationType.Noop)).toThrowError()
  })
})
