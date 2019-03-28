import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {RequestType} from "../../../../request/requestType"
import {SpellType} from "../../../../spell/spellType"
import MobBuilder from "../../../../test/mobBuilder"
import TestBuilder from "../../../../test/testBuilder"

let testBuilder: TestBuilder
let caster: MobBuilder
let target: MobBuilder
const defaultMessage = "a warm wave flows through you."

beforeEach(async () => {
  testBuilder = new TestBuilder()
  caster = testBuilder.withMob()
    .setLevel(30)
    .withSpell(SpellType.Heal, MAX_PRACTICE_LEVEL)
  target = testBuilder.withMob()
})

describe("heal spell action", () => {
  it("heals a target when casted", async () => {
    // setup
    target.setHp(1)

    // when
    await testBuilder.successfulAction(
      testBuilder.createRequest(RequestType.Cast, `cast heal '${target.getMobName()}'`, target.mob))

    // then
    expect(target.mob.vitals.hp).toBeGreaterThan(1)
  })

  it("generates accurate success messages when casting on target", async () => {
    // when
    const response = await testBuilder.successfulAction(
      testBuilder.createRequest(
        RequestType.Cast,
        `cast heal '${target.getMobName()}`,
        target.mob))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe(`a warm wave flows through ${target.getMobName()}.`)
    expect(response.message.getMessageToTarget()).toBe(defaultMessage)
    expect(response.message.getMessageToObservers()).toBe(`a warm wave flows through ${target.getMobName()}.`)
  })

  it("generates accurate success messages when casting on self", async () => {
    // when
    const response = await testBuilder.successfulAction(
      testBuilder.createRequest(
        RequestType.Cast,
        "cast 'heal'",
        caster.mob))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe(defaultMessage)
    expect(response.message.getMessageToTarget()).toBe(defaultMessage)
    expect(response.message.getMessageToObservers()).toBe(`a warm wave flows through ${caster.getMobName()}.`)
  })
})
