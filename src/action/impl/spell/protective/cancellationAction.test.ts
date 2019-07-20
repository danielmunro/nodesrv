import {AffectType} from "../../../../affect/enum/affectType"
import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {SpellType} from "../../../../mob/spell/spellType"
import {RequestType} from "../../../../request/enum/requestType"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner
let caster: MobBuilder
const castInput = "cast cancel"
const expectedMessage = "you suddenly feel more normal."

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  caster = (await testRunner.createMob())
    .withSpell(SpellType.Cancellation, MAX_PRACTICE_LEVEL)
})

describe("cancellation action", () => {
  it("strips affects when casted", async () => {
    caster.addAffectType(AffectType.Bless)
      .addAffectType(AffectType.Curse)
      .addAffectType(AffectType.Poison)
      .addAffectType(AffectType.Haste)
      .addAffectType(AffectType.Stunned)
    const affectsCount = caster.get().affects.length

    await testRunner.invokeActionSuccessfully(RequestType.Cast, castInput, caster.get())

    expect(caster.get().affects.length).toBeLessThan(affectsCount)
  })

  it("generates correct success message on self", async () => {
    caster.addAffectType(AffectType.Bless)
      .addAffectType(AffectType.Curse)
      .addAffectType(AffectType.Poison)
      .addAffectType(AffectType.Haste)
      .addAffectType(AffectType.Stunned)

    const response = await testRunner.invokeActionSuccessfully(RequestType.Cast, castInput, caster.get())

    expect(response.getMessageToRequestCreator()).toBe(expectedMessage)
    expect(response.getMessageToTarget()).toBe(expectedMessage)
    expect(response.getMessageToObservers()).toBe(`${caster.getMobName()} suddenly feels more normal.`)
  })

  it("generates correct success message on a target", async () => {
    const mob = await testRunner.createMob()
    mob.addAffectType(AffectType.Bless)
      .addAffectType(AffectType.Curse)
      .addAffectType(AffectType.Poison)
      .addAffectType(AffectType.Haste)
      .addAffectType(AffectType.Stunned)

    const response = await testRunner.invokeActionSuccessfully(
      RequestType.Cast, `cast cancel '${mob.getMobName()}'`, mob.get())

    expect(response.getMessageToRequestCreator()).toBe(`${mob.getMobName()} suddenly feels more normal.`)
    expect(response.getMessageToTarget()).toBe("you suddenly feel more normal.")
    expect(response.getMessageToObservers()).toBe(`${mob.getMobName()} suddenly feels more normal.`)
  })
})
