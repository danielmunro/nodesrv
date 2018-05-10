import { getTestMob } from "../test/mob"
import { assignSpecializationToMob } from "./service"
import Cleric from "./specialization/cleric"
import Warrior from "./specialization/warrior"

describe("mob service", () => {
  it("should be able to assign a specialization to a mob", () => {
    // setup
    const mob = getTestMob()

    // expect
    expect(mob.specialization).toBeUndefined()
    expect(mob.skills.length).toBe(0)
    expect(mob.spells.length).toBe(0)

    // when
    assignSpecializationToMob(mob, new Cleric())

    // then
    expect(mob.specialization).not.toBeUndefined()
    expect(mob.skills.length).toBeGreaterThan(0)
    expect(mob.spells.length).toBeGreaterThan(0)
  })

  it("should not be able to assign a specialization if a mob already has a specialization", () => {
    // setup
    const mob = getTestMob()
    assignSpecializationToMob(mob, new Cleric())

    // when/then
    expect(() => assignSpecializationToMob(mob, new Warrior())).toThrowError()
  })

  it("should apply attributes to a mob", () => {
    // setup
    const mob = getTestMob()
    const attributeCount = mob.attributes.length

    // when
    assignSpecializationToMob(mob, new Cleric())

    // then
    expect(mob.attributes.length).toBe(attributeCount + 1)
  })
})
