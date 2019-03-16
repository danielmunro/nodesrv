import {AffectType} from "../../../../../affect/affectType"
import {MAX_PRACTICE_LEVEL} from "../../../../../mob/constants"
import {RequestType} from "../../../../../request/requestType"
import {SpellType} from "../../../../../spell/spellType"
import {getSuccessfulAction} from "../../../../../support/functional/times"
import MobBuilder from "../../../../../test/mobBuilder"
import TestBuilder from "../../../../../test/testBuilder"

let testBuilder: TestBuilder
let caster: MobBuilder

beforeEach(() => {
  testBuilder = new TestBuilder()
  caster = testBuilder.withMob()
    .withSpell(SpellType.ProtectionGood, MAX_PRACTICE_LEVEL)
})

describe("protection good spell action", () => {
  it("applies the affect", async () => {
    // when
    await getSuccessfulAction(
      await testBuilder.getAction(RequestType.Cast),
      testBuilder.createRequest(RequestType.Cast, "cast 'protection good'", caster.mob))

    // then
    expect(caster.hasAffect(AffectType.ProtectionGood)).toBeTruthy()
  })
})
