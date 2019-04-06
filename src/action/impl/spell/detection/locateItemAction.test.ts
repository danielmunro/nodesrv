import {AffectType} from "../../../../affect/affectType"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {RequestType} from "../../../../request/requestType"
import {SpellType} from "../../../../spell/spellType"
import MobBuilder from "../../../../test/mobBuilder"
import TestBuilder from "../../../../test/testBuilder"

let testBuilder: TestBuilder
let caster: MobBuilder

beforeEach(() => {
  testBuilder = new TestBuilder()
  caster = testBuilder.withMob().setLevel(30).withSpell(SpellType.LocateItem, MAX_PRACTICE_LEVEL)
})

describe("locate item spell action", () => {
  it("will not locate items with no locate affect type", async () => {
    // given
    testBuilder.withItem().asShield().addAffect(AffectType.NoLocate).build()
    const anotherMob = testBuilder.withMob()
    testBuilder.withItem().asShield().equipToMobBuilder(anotherMob).build()

    // when
    const response = await testBuilder.successfulAction(
      testBuilder.createRequest(RequestType.Cast, "cast locate shield"))

    // then
    expect(response.getMessageToRequestCreator()).toBe(`a wooden practice shield was located:

carried by ${anotherMob.getMobName()}.`)
  })

  it("will find an item when all conditions match", async () => {
    // given
    testBuilder.withWeapon().asAxe().build()

    // when
    const response = await testBuilder.successfulAction(
      testBuilder.createRequest(RequestType.Cast, "cast locate axe"))

    // then
    expect(response.getMessageToRequestCreator()).toBe(`a wood chopping axe was located:

carried by ${caster.getMobName()}.`)
  })
})
