import {AffectType} from "../../../../affect/affectType"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {RequestType} from "../../../../request/requestType"
import {SpellType} from "../../../../spell/spellType"
import MobBuilder from "../../../../test/mobBuilder"
import TestBuilder from "../../../../test/testBuilder"

let testBuilder: TestBuilder
let caster: MobBuilder
const expectedMessage = "you are engulfed in a white aura."

beforeEach(() => {
  testBuilder = new TestBuilder()
  caster = testBuilder.withMob()
    .withSpell(SpellType.ProtectionEvil, MAX_PRACTICE_LEVEL)
})

describe("protection evil spell action", () => {
  it("applies the affect", async () => {
    // when
    await testBuilder.successfulAction(
      testBuilder.createRequest(RequestType.Cast, "cast 'protection evil'", caster.mob))

    // then
    expect(caster.hasAffect(AffectType.ProtectionEvil)).toBeTruthy()
  })

  it("generates accurate success messages on self", async () => {
    const response = await testBuilder.successfulAction(
      testBuilder.createRequest(RequestType.Cast, "cast 'protection evil'", caster.mob))

    expect(response.getMessageToRequestCreator()).toBe(expectedMessage)
    expect(response.message.getMessageToTarget()).toBe(expectedMessage)
    expect(response.message.getMessageToObservers()).toBe(`${caster.getMobName()} is engulfed in a white aura.`)
  })

  it("generates accurate success messages on a target", async () => {
    const target = testBuilder.withMob()

    const response = await testBuilder.successfulAction(
      testBuilder.createRequest(RequestType.Cast, `cast 'protection evil' ${target.getMobName()}`, target.mob))

    expect(response.getMessageToRequestCreator()).toBe(`${target.getMobName()} is engulfed in a white aura.`)
    expect(response.message.getMessageToTarget()).toBe(expectedMessage)
    expect(response.message.getMessageToObservers()).toBe(`${target.getMobName()} is engulfed in a white aura.`)
  })
})
