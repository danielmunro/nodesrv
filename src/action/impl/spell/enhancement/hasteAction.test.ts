import {AffectType} from "../../../../affect/affectType"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {RequestType} from "../../../../request/requestType"
import {SpellType} from "../../../../spell/spellType"
import {getSuccessfulAction} from "../../../../support/functional/times"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestBuilder from "../../../../support/test/testBuilder"

let testBuilder: TestBuilder
let caster: MobBuilder
let target: MobBuilder
const expectedMessage = "you begin moving quickly."

beforeEach(() => {
  testBuilder = new TestBuilder()
  caster = testBuilder.withMob().setLevel(20).withSpell(SpellType.Haste, MAX_PRACTICE_LEVEL)
  target = testBuilder.withMob()
})

describe("haste spell action", () => {
  it("imparts the haste affect", async () => {
    // when
    await getSuccessfulAction(
      await testBuilder.getAction(RequestType.Cast),
      testBuilder.createRequest(RequestType.Cast, "cast haste", caster.mob))

    // then
    expect(caster.mob.affect().has(AffectType.Haste)).toBeTruthy()
  })

  it("generates accurate success messages on self", async () => {
    // when
    const response = await getSuccessfulAction(
      await testBuilder.getAction(RequestType.Cast),
      testBuilder.createRequest(RequestType.Cast, "cast haste", caster.mob))

    expect(response.getMessageToRequestCreator()).toBe(expectedMessage)
    expect(response.message.getMessageToTarget()).toBe(expectedMessage)
    expect(response.message.getMessageToObservers()).toBe(`${caster.getMobName()} begins moving quickly.`)
  })

  it("generates accurate success messages on a target", async () => {
    // when
    const response = await getSuccessfulAction(
      await testBuilder.getAction(RequestType.Cast),
      testBuilder.createRequest(RequestType.Cast, `cast haste ${target.getMobName()}`, target.mob))

    expect(response.getMessageToRequestCreator()).toBe(`${target.getMobName()} begins moving quickly.`)
    expect(response.message.getMessageToTarget()).toBe(expectedMessage)
    expect(response.message.getMessageToObservers()).toBe(`${target.getMobName()} begins moving quickly.`)
  })
})
