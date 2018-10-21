import { RequestType } from "../../request/requestType"
import spellTable from "../spellTable"
import { SpellType } from "../spellType"
import TestBuilder from "../../test/testBuilder"
import { MAX_PRACTICE_LEVEL } from "../../mob/constants"

describe("lightning bolt", () => {
  it("should do damage when casted", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const mobBuilder1 = testBuilder.withMob()
    mobBuilder1.withLevel(5)
    mobBuilder1.withSpell(SpellType.LightningBolt, MAX_PRACTICE_LEVEL)
    const mobBuilder2 = testBuilder.withMob("bob")
    const mob = mobBuilder2.mob
    const definition = spellTable.findSpell(SpellType.LightningBolt)

    // when
    await definition.doAction(testBuilder.createRequest(RequestType.Cast, "cast lightning bob", mob))

    // then
    expect(mob.vitals.hp).toBeLessThan(mob.getCombinedAttributes().vitals.hp)
  })
})
