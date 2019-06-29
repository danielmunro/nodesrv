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
const expectedMessage = "you are surrounded by an orb of touch."

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  caster = testRunner.createMob()
    .withSpell(SpellType.OrbOfTouch, MAX_PRACTICE_LEVEL)
    .setLevel(30)
})

describe("orb of touch spell action", () => {
  it("imparts orb of touch affect", async () => {
    // when
    await testRunner.invokeActionSuccessfully(RequestType.Cast, "cast 'orb of touch'", caster.get())

    // then
    expect(caster.hasAffect(AffectType.OrbOfTouch)).toBeTruthy()
  })

  it("generates accurate success messages when casting on self", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(RequestType.Cast, "cast 'orb of touch'", caster.get())

    // then
    expect(response.getMessageToRequestCreator()).toBe(expectedMessage)
    expect(response.getMessageToTarget()).toBe(expectedMessage)
    expect(response.getMessageToObservers()).toBe(`${caster.getMobName()} is surrounded by an orb of touch.`)
  })

  it("generates accurate success messages when casting on a target", async () => {
    // given
    const target = testRunner.createMob()

    // when
    const response = await testRunner.invokeActionSuccessfully(
        RequestType.Cast,
        `cast 'orb of touch' ${target.getMobName()}`,
        target.get())

    // then
    expect(response.getMessageToRequestCreator()).toBe(`${target.getMobName()} is surrounded by an orb of touch.`)
    expect(response.getMessageToTarget()).toBe(expectedMessage)
    expect(response.getMessageToObservers()).toBe(`${target.getMobName()} is surrounded by an orb of touch.`)
  })
})
