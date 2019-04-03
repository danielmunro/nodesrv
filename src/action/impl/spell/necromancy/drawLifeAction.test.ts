import AttributeService from "../../../../attributes/attributeService"
import {RequestType} from "../../../../request/requestType"
import {SpellType} from "../../../../spell/spellType"
import {getSuccessfulAction} from "../../../../support/functional/times"
import MobBuilder from "../../../../test/mobBuilder"
import TestBuilder from "../../../../test/testBuilder"

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
    caster.mob.vitals.hp = 1

    // when
    await getSuccessfulAction(
      await testBuilder.getAction(RequestType.Cast),
      testBuilder.createRequest(RequestType.Cast, `cast draw ${target.getMobName()}`, target.mob))

    // then
    expect(caster.mob.vitals.hp).toBeGreaterThan(1)
    expect(target.mob.vitals.hp).toBeLessThan(AttributeService.getHp(target.mob))
  })

  it("generates accurate success messages", async () => {
    const response = await getSuccessfulAction(
      await testBuilder.getAction(RequestType.Cast),
      testBuilder.createRequest(RequestType.Cast, `cast draw ${target.getMobName()}`, target.mob))

    expect(response.getMessageToRequestCreator())
      .toBe(`you siphon life force from ${target.getMobName()}.`)
    expect(response.message.getMessageToTarget())
      .toBe(`${caster.getMobName()} siphons life force from you.`)
    expect(response.message.getMessageToObservers())
      .toBe(`${caster.getMobName()} siphons life force from ${target.getMobName()}.`)
  })
})
