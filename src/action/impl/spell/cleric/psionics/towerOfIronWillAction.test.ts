import {AffectType} from "../../../../../affect/affectType"
import {MAX_PRACTICE_LEVEL} from "../../../../../mob/constants"
import {RequestType} from "../../../../../request/requestType"
import {SpellType} from "../../../../../spell/spellType"
import {getSuccessfulAction} from "../../../../../support/functional/times"
import MobBuilder from "../../../../../test/mobBuilder"
import TestBuilder from "../../../../../test/testBuilder"

let testBuilder: TestBuilder
let caster: MobBuilder
const expectedMessage = "your will cannot be broken."

beforeEach(() => {
  testBuilder = new TestBuilder()
  caster = testBuilder.withMob()
    .withSpell(SpellType.TowerOfIronWill, MAX_PRACTICE_LEVEL)
    .setLevel(30)
})

describe("tower of iron will spell action", () => {
  it("imparts the affect", async () => {
    // when
    await getSuccessfulAction(
      await testBuilder.getAction(RequestType.Cast),
      testBuilder.createRequest(RequestType.Cast, "cast tower", caster.mob))

    // then
    expect(caster.hasAffect(AffectType.TowerOfIronWill)).toBeTruthy()
  })

  it("generates accurate success messages against self", async () => {
    // when
    const response = await getSuccessfulAction(
      await testBuilder.getAction(RequestType.Cast),
      testBuilder.createRequest(RequestType.Cast, "cast tower", caster.mob))

    // then
    expect(response.getMessageToRequestCreator()).toBe(expectedMessage)
    expect(response.message.getMessageToTarget()).toBe(expectedMessage)
    expect(response.message.getMessageToObservers()).toBe(`${caster.getMobName()}'s will cannot be broken.`)
  })

  it("generates accurate success messages against a target", async () => {
    // given
    const target = testBuilder.withMob()

    // when
    const response = await getSuccessfulAction(
      await testBuilder.getAction(RequestType.Cast),
      testBuilder.createRequest(RequestType.Cast, `cast tower ${target.getMobName()}`, target.mob))

    // then
    expect(response.getMessageToRequestCreator()).toBe(`${target.getMobName()}'s will cannot be broken.`)
    expect(response.message.getMessageToTarget()).toBe(expectedMessage)
    expect(response.message.getMessageToObservers()).toBe(`${target.getMobName()}'s will cannot be broken.`)
  })
})
