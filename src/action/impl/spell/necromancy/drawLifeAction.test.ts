import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {RequestType} from "../../../../messageExchange/enum/requestType"
import {SpellType} from "../../../../mob/spell/spellType"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner
let caster: MobBuilder
let target: MobBuilder

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  caster = (await testRunner.createMob())
    .setLevel(40)
    .withSpell(SpellType.DrawLife)
  target = (await testRunner.createMob()).setLevel(40)
})

describe("draw life action", () => {
  it("transfers life points from the target to the caster", async () => {
    // given
    const startingHp = 1
    caster.setHp(startingHp)

    // when
    await testRunner.invokeActionSuccessfully(
        RequestType.Cast, `cast draw ${target.getMobName()}`, target.get())

    // then
    expect(caster.getHp()).toBeGreaterThan(startingHp)

    // and
    const attr = target.mob.attribute()
    expect(attr.getHp()).toBeLessThan(attr.getMaxHp())
  })

  it("generates accurate success messages", async () => {
    const response = await testRunner.invokeActionSuccessfully(
        RequestType.Cast, `cast draw ${target.getMobName()}`, target.get())

    expect(response.getMessageToRequestCreator())
      .toBe(`you siphon life force from ${target.getMobName()}.`)
    expect(response.getMessageToTarget())
      .toBe(`${caster.getMobName()} siphons life force from you.`)
    expect(response.getMessageToObservers())
      .toBe(`${caster.getMobName()} siphons life force from ${target.getMobName()}.`)
  })
})
