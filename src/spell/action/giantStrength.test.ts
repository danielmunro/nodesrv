import {AffectType} from "../../affect/affectType"
import {MAX_PRACTICE_LEVEL} from "../../mob/constants"
import {SpecializationType} from "../../mob/specialization/specializationType"
import {RequestType} from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import {SpellType} from "../spellType"

describe.skip("giant strength", () => {
  it("should cast giant strength", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const mobBuilder1 = testBuilder.withMob("alice", SpecializationType.Cleric)
    mobBuilder1.withSpell(SpellType.GiantStrength, MAX_PRACTICE_LEVEL)
    mobBuilder1.withLevel(30)
    const mobBuilder2 = testBuilder.withMob("bob")
    const mob = mobBuilder2.mob
    const definition = await testBuilder.getSpellDefinition(SpellType.GiantStrength)

    // when
    await definition.doAction(testBuilder.createRequest(RequestType.Cast, "cast giant bob", mob))

    // then
    expect(mob.getAffect(AffectType.GiantStrength)).toBeTruthy()
  })
})
