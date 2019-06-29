import {AffectType} from "../../../../affect/enum/affectType"
import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {RequestType} from "../../../../request/enum/requestType"
import {SpellType} from "../../../../mob/spell/spellType"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner
let caster: MobBuilder

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  testRunner.setTime(12)
  caster = testRunner.createMob()
    .setLevel(30)
    .withSpell(SpellType.LocateItem, MAX_PRACTICE_LEVEL)
})

describe("locate item spell action", () => {
  it("will not locate items with no locate affect type", async () => {
    // given
    const item1 = testRunner.createItem()
      .asShield()
      .addAffect(AffectType.NoLocate)
      .build()
    const anotherMob = testRunner.createMob()
    const item2 = testRunner.createItem()
      .asShield()
      .build()
    testRunner.getStartRoom().addItem(item1)
    anotherMob.equip(item2)

    // when
    const response = await testRunner.invokeActionSuccessfully(RequestType.Cast, "cast locate shield")

    // then
    expect(response.getMessageToRequestCreator()).toBe(`a wooden practice shield was located:

carried by ${anotherMob.getMobName()}.`)
  })

  it("will find an item when all conditions match", async () => {
    // given
    const item = testRunner.createWeapon().asAxe().build()
    caster.addItem(item)

    // when
    const response = await testRunner.invokeActionSuccessfully(RequestType.Cast, "cast locate axe")

    // then
    expect(response.getMessageToRequestCreator()).toBe(`a wood chopping axe was located:

carried by ${caster.getMobName()}.`)
  })
})
