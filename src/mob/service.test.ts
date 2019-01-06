import { getTestMob } from "../test/mob"
import { assignSpecializationToMob } from "./mobService"
import Cleric from "./specialization/cleric"

describe("mob gameService", () => {
  it("should be able to assign a specialization to a mob", () => {
    // setup
    const mob = getTestMob()

    // expect
    expect(mob.skills.length).toBe(0)
    expect(mob.spells.length).toBe(0)

    // when
    assignSpecializationToMob(mob, new Cleric())

    // then
    expect(mob.specialization).not.toBeUndefined()
    expect(mob.skills.length).toBeGreaterThan(0)
    expect(mob.spells.length).toBeGreaterThan(0)
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
