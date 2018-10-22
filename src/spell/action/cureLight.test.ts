import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import spellTable from "../spellTable"
import { SpellType } from "../spellType"

describe("cure light", () => {
  it("should heal when casted", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const mobBuilder1 = testBuilder.withMob()
    mobBuilder1.withSpell(SpellType.CureLight, MAX_PRACTICE_LEVEL)
    const mobBuilder2 = testBuilder.withMob("bob")
    const mob = mobBuilder2.mob
    mob.vitals.hp = 1
    const definition = spellTable.findSpell(SpellType.CureLight)

    // when
    await definition.doAction(testBuilder.createRequest(RequestType.Cast, "cast cure bob", mob))

    // then
    expect(mob.vitals.hp).toBeGreaterThan(1)
  })
})
