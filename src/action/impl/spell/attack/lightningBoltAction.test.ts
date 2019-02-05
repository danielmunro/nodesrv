import { MAX_PRACTICE_LEVEL } from "../../../../mob/constants"
import { RequestType } from "../../../../request/requestType"
import { SpellType } from "../../../../spell/spellType"
import {doNTimesOrUntilTruthy} from "../../../../support/functional/times"
import TestBuilder from "../../../../test/testBuilder"

describe("lightning bolt", () => {
  it("should do damage when casted", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const mobBuilder1 = testBuilder.withMob()
    mobBuilder1.withLevel(30)
    mobBuilder1.withSpell(SpellType.LightningBolt, MAX_PRACTICE_LEVEL)
    const mobBuilder2 = testBuilder.withMob("bob")
    const mob = mobBuilder2.mob
    const spell = await testBuilder.getSpellDefinition(SpellType.LightningBolt)

    // when
    const response = await doNTimesOrUntilTruthy(100, async () => {
      const handled = await spell.handle(testBuilder.createRequest(RequestType.Cast, "cast lightning bob", mob))
      return handled.isSuccessful() ? handled : null
    })

    // then
    expect(response.isSuccessful()).toBeTruthy()
    expect(mob.vitals.hp).toBeLessThan(mob.getCombinedAttributes().vitals.hp)
  })
})
