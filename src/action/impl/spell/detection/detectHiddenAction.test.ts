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
let target: MobBuilder
const castCommand = "cast 'detect hidden'"
const responseMessage = "your eyes tingle."

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  caster = (await testRunner.createMob())
    .withSpell(SpellType.DetectHidden, MAX_PRACTICE_LEVEL)
    .setLevel(30)
  target = await testRunner.createMob()
})

describe("detect hidden spell action", () => {
  it("gives detect hidden affect type when casted", async () => {
    // when
    await testRunner.invokeActionSuccessfully(RequestType.Cast, castCommand, caster.get())

    // then
    expect(caster.hasAffect(AffectType.DetectHidden)).toBeTruthy()
  })

  it("generates accurate success messages when casting on a target", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(RequestType.Cast, castCommand, target.get())

    // then
    expect(response.getMessageToRequestCreator()).toBe(`${target.getMobName()}'s eyes tingle.`)
    expect(response.getMessageToTarget()).toBe(responseMessage)
    expect(response.getMessageToObservers()).toBe(`${target.getMobName()}'s eyes tingle.`)
  })

  it("generates accurate success messages when casting on self", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(RequestType.Cast, castCommand, caster.get())

    // then
    expect(response.getMessageToRequestCreator()).toBe(responseMessage)
    expect(response.getMessageToTarget()).toBe(responseMessage)
    expect(response.getMessageToObservers()).toBe(`${caster.getMobName()}'s eyes tingle.`)
  })
})
