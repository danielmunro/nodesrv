import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import { SpellType } from "../spellType"

describe.skip("cure poison", () => {
  it("should cure poison when casted", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const mobBuilder1 = testBuilder.withMob()
    mobBuilder1.withSpell(SpellType.CurePoison, MAX_PRACTICE_LEVEL)
    mobBuilder1.withLevel(20)
    const mobBuilder2 = testBuilder.withMob("bob")
    const mob = mobBuilder2.mob
    mob.addAffect(newAffect(AffectType.Poison))
    const definition = await testBuilder.getSpellDefinition(SpellType.CurePoison)

    // when
    await definition.doAction(testBuilder.createRequest(RequestType.Cast, "cast cure bob", mob))

    // then
    expect(mob.getAffect(AffectType.Poison)).toBeFalsy()
  })
})
