import {AffectType} from "../../../../affect/affectType"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {RequestType} from "../../../../request/requestType"
import {SpellType} from "../../../../spell/spellType"
import MobBuilder from "../../../../test/mobBuilder"
import TestBuilder from "../../../../test/testBuilder"

let testBuilder: TestBuilder
let caster: MobBuilder
const expectedMessage = "you are engulfed in a dark aura."

beforeEach(() => {
  testBuilder = new TestBuilder()
  caster = testBuilder.withMob()
    .withSpell(SpellType.ProtectionGood, MAX_PRACTICE_LEVEL)
})

describe("protection good spell action", () => {
  it("applies the affect", async () => {
    // when
    await testBuilder.successfulAction(
      testBuilder.createRequest(RequestType.Cast, "cast 'protection good'", caster.mob))

    // then
    expect(caster.hasAffect(AffectType.ProtectionGood)).toBeTruthy()
  })

  it("generates accurate success messages on self", async () => {
    const response = await testBuilder.successfulAction(
      testBuilder.createRequest(RequestType.Cast, "cast 'protection good'", caster.mob))

    expect(response.getMessageToRequestCreator()).toBe(expectedMessage)
    expect(response.message.getMessageToTarget()).toBe(expectedMessage)
    expect(response.message.getMessageToObservers()).toBe(`${caster.getMobName()} is engulfed in a dark aura.`)
  })

  it("generates accurate success messages on a target", async () => {
    const target = testBuilder.withMob()

    const response = await testBuilder.successfulAction(
      testBuilder.createRequest(RequestType.Cast, `cast 'protection good' ${target.getMobName()}`, target.mob))

    expect(response.getMessageToRequestCreator()).toBe(`${target.getMobName()} is engulfed in a dark aura.`)
    expect(response.message.getMessageToTarget()).toBe(expectedMessage)
    expect(response.message.getMessageToObservers()).toBe(`${target.getMobName()} is engulfed in a dark aura.`)
  })
})
