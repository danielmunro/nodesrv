import Cleric from "./cleric"
import { createSpecializationFromType } from "./factory"
import Mage from "./mage"
import Ranger from "./ranger"
import { SpecializationType } from "./specializationType"
import Warrior from "./warrior"

describe("specialization factory", () => {
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

  it("should throw an error if the specialization type is unknown", () => {
    expect(() => createSpecializationFromType(SpecializationType.Noop)).toThrowError()
  })
})
