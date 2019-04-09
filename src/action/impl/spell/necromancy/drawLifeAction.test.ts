import {RequestType} from "../../../../request/requestType"
import {SpellType} from "../../../../spell/spellType"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestBuilder from "../../../../support/test/testBuilder"

let testBuilder: TestBuilder
let caster: MobBuilder
let target: MobBuilder

beforeEach(() => {
  testBuilder = new TestBuilder()
  caster = testBuilder.withMob().setLevel(40).withSpell(SpellType.DrawLife)
  target = testBuilder.withMob().setLevel(40)
})

describe("draw life action", () => {
  it("transfers life points from the target to the caster", async () => {
    // given
    const startingHp = 1
    caster.mob.vitals.hp = startingHp

    // when
    await testBuilder.successfulAction(
      testBuilder.createRequest(
        RequestType.Cast, `cast draw ${target.getMobName()}`, target.mob))

    // then
    expect(caster.mob.attribute().getHp()).toBeGreaterThan(startingHp)

    // and
    const attr = target.mob.attribute()
    expect(attr.getHp()).toBeLessThan(attr.getMaxHp())
  })

  it("generates accurate success messages", async () => {
    const response = await testBuilder.successfulAction(
      testBuilder.createRequest(
        RequestType.Cast, `cast draw ${target.getMobName()}`, target.mob))

    expect(response.getMessageToRequestCreator())
      .toBe(`you siphon life force from ${target.getMobName()}.`)
    expect(response.message.getMessageToTarget())
      .toBe(`${caster.getMobName()} siphons life force from you.`)
    expect(response.message.getMessageToObservers())
      .toBe(`${caster.getMobName()} siphons life force from ${target.getMobName()}.`)
  })
})
