import {AffectType} from "../../../../affect/affectType"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {SpecializationType} from "../../../../mob/specialization/specializationType"
import {RequestType} from "../../../../request/requestType"
import {SpellType} from "../../../../spell/spellType"
import {doNTimesOrUntilTruthy} from "../../../../support/functional/times"
import TestBuilder from "../../../../test/testBuilder"

describe("shield", () => {
  it("should shield when casted", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const mobBuilder1 = testBuilder.withMob("alice", SpecializationType.Cleric)
    mobBuilder1.withSpell(SpellType.Shield, MAX_PRACTICE_LEVEL)
    mobBuilder1.withLevel(30)
    const mobBuilder2 = testBuilder.withMob("bob")
    const mob = mobBuilder2.mob
    const definition = await testBuilder.getSpellDefinition(SpellType.Shield)

    // when
    await doNTimesOrUntilTruthy(100, async () => {
      const handled = await definition.handle(testBuilder.createRequest(RequestType.Cast, "cast shield bob", mob))
      return handled.isSuccessful() ? handled : null
    })

    // then
    expect(mob.getAffect(AffectType.Shield)).toBeTruthy()
  })
})
