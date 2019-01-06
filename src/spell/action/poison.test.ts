import {AffectType} from "../../affect/affectType"
import {MAX_PRACTICE_LEVEL} from "../../mob/constants"
import {SpecializationType} from "../../mob/specialization/specializationType"
import {RequestType} from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import {SpellType} from "../spellType"

describe("poison", () => {
  it("should poison when casted", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const mobBuilder1 = testBuilder.withMob()
    mobBuilder1.withSpell(SpellType.Poison, MAX_PRACTICE_LEVEL)
    mobBuilder1.withLevel(30)
    const mobBuilder2 = testBuilder.withMob("bob", SpecializationType.Mage)
    const mob = mobBuilder2.mob
    const definition = await testBuilder.getSpellDefinition(SpellType.Poison)

    // when
    await definition.doAction(testBuilder.createRequest(RequestType.Cast, "cast poison bob", mob))

    // then
    expect(mob.getAffect(AffectType.Poison)).toBeTruthy()
  })
})
