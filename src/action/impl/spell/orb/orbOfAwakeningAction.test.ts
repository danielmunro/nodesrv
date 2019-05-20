import {AffectType} from "../../../../affect/enum/affectType"
import {createTestAppContainer} from "../../../../app/testFactory"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {RequestType} from "../../../../request/enum/requestType"
import {SpellType} from "../../../../spell/spellType"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner
let caster: MobBuilder
const expectedMessage = "you are surrounded by an orb of awakening."

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  caster = testRunner.createMob()
    .withSpell(SpellType.OrbOfAwakening, MAX_PRACTICE_LEVEL)
    .setLevel(30)
})

describe("orb of awakening spell action", () => {
  it("imparts orb of awakening affect", async () => {
    // when
    await testRunner.invokeActionSuccessfully(RequestType.Cast, "cast 'orb of awakening'", caster.get())

    // then
    expect(caster.hasAffect(AffectType.OrbOfAwakening)).toBeTruthy()
  })

  it("generates accurate success messages when casting on self", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(
      RequestType.Cast, "cast 'orb of awakening'", caster.get())

    // then
    expect(response.getMessageToRequestCreator()).toBe(expectedMessage)
    expect(response.getMessageToTarget()).toBe(expectedMessage)
    expect(response.getMessageToObservers())
      .toBe(`${caster.getMobName()} is surrounded by an orb of awakening.`)
  })

  it("generates accurate success messages when casting on a target", async () => {
    // given
    const target = testRunner.createMob()

    // when
    const response = await testRunner.invokeActionSuccessfully(
        RequestType.Cast,
        `cast 'orb of awakening' ${target.getMobName()}`,
        target.get())

    // then
    expect(response.getMessageToRequestCreator()).toBe(`${target.getMobName()} is surrounded by an orb of awakening.`)
    expect(response.getMessageToTarget()).toBe(expectedMessage)
    expect(response.getMessageToObservers())
      .toBe(`${target.getMobName()} is surrounded by an orb of awakening.`)
  })
})
