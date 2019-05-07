import {AffectType} from "../../../../affect/affectType"
import {createTestAppContainer} from "../../../../inversify.config"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {RequestType} from "../../../../request/requestType"
import {SpellType} from "../../../../spell/spellType"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner
let target: MobBuilder

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  testRunner.createMob()
    .withSpell(SpellType.Wrath, MAX_PRACTICE_LEVEL)
    .setLevel(30)
  target = testRunner.createMob()
})

describe("wrath action", () => {
  it("imparts wrath affect", async () => {
    await testRunner.invokeActionSuccessfully(
      RequestType.Cast, `cast wrath ${target.getMobName()}`, target.get())

    expect(target.hasAffect(AffectType.Wrath)).toBeTruthy()
  })

  it("generates accurate success messages", async () => {
    const response = await testRunner.invokeActionSuccessfully(
      RequestType.Cast, `cast wrath ${target.getMobName()}`, target.get())

    expect(response.getMessageToRequestCreator())
      .toBe(`${target.getMobName()} is surrounded by wrathful energy.`)
    expect(response.getMessageToTarget()).toBe(`you are surrounded by wrathful energy.`)
    expect(response.getMessageToObservers())
      .toBe(`${target.getMobName()} is surrounded by wrathful energy.`)
  })
})
