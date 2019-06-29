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
let target: MobBuilder
const castCommand = "cast fly"
const responseMessage = "your feet rise off the ground."

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  caster = testRunner.createMob()
    .withSpell(SpellType.Fly, MAX_PRACTICE_LEVEL)
    .setLevel(30)
  target = testRunner.createMob()
})

describe("fly spell action", () => {
  it("gives fly affect type when casted", async () => {
    // when
    await testRunner.invokeActionSuccessfully(RequestType.Cast, castCommand, target.get())

    // then
    expect(target.hasAffect(AffectType.Fly)).toBeTruthy()
  })

  it("generates accurate success messages when casting on a target", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(RequestType.Cast, castCommand, target.get())

    // then
    expect(response.getMessageToRequestCreator())
      .toBe(`${target.getMobName()}'s feet rise off the ground.`)
    expect(response.getMessageToTarget()).toBe(responseMessage)
    expect(response.getMessageToObservers())
      .toBe(`${target.getMobName()}'s feet rise off the ground.`)
  })

  it("generates accurate success messages when casting on self", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(RequestType.Cast, castCommand, caster.get())

    // then
    expect(response.getMessageToRequestCreator()).toBe(responseMessage)
    expect(response.getMessageToTarget()).toBe(responseMessage)
    expect(response.getMessageToObservers())
      .toBe(`${caster.getMobName()}'s feet rise off the ground.`)
  })
})
