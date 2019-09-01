import {AffectType} from "../../../../affect/enum/affectType"
import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {RequestType} from "../../../../messageExchange/enum/requestType"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {SpellType} from "../../../../mob/spell/spellType"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner
let caster: MobBuilder
const expectedMessage = "you glow with a blue aura."

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  caster = (await testRunner.createMob())
    .setLevel(30)
    .withSpell(SpellType.Fireproof, MAX_PRACTICE_LEVEL)
})

describe("fireproof action", () => {
  it("adds fireproof affect to the target", async () => {
    await testRunner.invokeActionSuccessfully(RequestType.Cast, "cast fireproof", caster.get())

    expect(caster.hasAffect(AffectType.Fireproof)).toBeTruthy()
  })

  it("generates accurate success messages on self", async () => {
    const response = await testRunner.invokeActionSuccessfully(RequestType.Cast, "cast fireproof", caster.get())

    expect(response.getMessageToRequestCreator()).toBe(expectedMessage)
    expect(response.getMessageToTarget()).toBe(expectedMessage)
    expect(response.getMessageToObservers()).toBe(`${caster.getMobName()} glows with a blue aura.`)
  })

  it("generates accurate success messages on a target", async () => {
    const target = await testRunner.createMob()
    const response = await testRunner.invokeActionSuccessfully(
      RequestType.Cast, `cast fireproof '${target.getMobName()}'`, target.get())

    expect(response.getMessageToRequestCreator()).toBe(`${target.getMobName()} glows with a blue aura.`)
    expect(response.getMessageToTarget()).toBe(expectedMessage)
    expect(response.getMessageToObservers()).toBe(`${target.getMobName()} glows with a blue aura.`)
  })
})
