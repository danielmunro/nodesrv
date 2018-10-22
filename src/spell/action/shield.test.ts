import { AffectType } from "../../affect/affectType"
import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import spellTable from "../spellTable"
import { SpellType } from "../spellType"

describe("shield", () => {
  it("should shield when casted", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const mobBuilder1 = testBuilder.withMob()
    mobBuilder1.withSpell(SpellType.Shield, MAX_PRACTICE_LEVEL)
    mobBuilder1.withLevel(5)
    const mobBuilder2 = testBuilder.withMob("bob")
    const mob = mobBuilder2.mob
    const definition = spellTable.findSpell(SpellType.Shield)

    // when
    await definition.doAction(testBuilder.createRequest(RequestType.Cast, "cast shield bob", mob))

    // then
    expect(mob.getAffect(AffectType.Shield)).toBeTruthy()
  })
})
