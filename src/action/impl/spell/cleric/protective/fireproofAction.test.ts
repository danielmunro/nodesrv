import {AffectType} from "../../../../../affect/affectType"
import {RequestType} from "../../../../../request/requestType"
import {SpellType} from "../../../../../spell/spellType"
import {getSuccessfulAction} from "../../../../../support/functional/times"
import MobBuilder from "../../../../../test/mobBuilder"
import TestBuilder from "../../../../../test/testBuilder"

let testBuilder: TestBuilder
let caster: MobBuilder

beforeEach(() => {
  testBuilder = new TestBuilder()
  caster = testBuilder.withMob().setLevel(30).withSpell(SpellType.Fireproof)
})

describe("fireproof action", () => {
  it("adds fireproof affect to the target", async () => {
    await getSuccessfulAction(
      await testBuilder.getAction(RequestType.Cast),
      testBuilder.createRequest(RequestType.Cast, "cast fireproof", caster.mob))

    expect(caster.hasAffect(AffectType.Fireproof)).toBeTruthy()
  })
})
