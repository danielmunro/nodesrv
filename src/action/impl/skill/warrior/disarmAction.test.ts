import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {RequestType} from "../../../../messageExchange/enum/requestType"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {ConditionMessages} from "../../../../mob/skill/constants"
import {SkillType} from "../../../../mob/skill/skillType"
import doNTimes, {doNTimesOrUntilTruthy} from "../../../../support/functional/times"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

const iterations = 1000
let testRunner: TestRunner
let mob1: MobBuilder
let mob2: MobBuilder

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  mob1 = (await testRunner.createMob()).setLevel(50)
  mob2 = (await testRunner.createMob()).setLevel(50)
})

describe("disarm skill action", () => {
  it("should disarm the equipped weapon onto the ground only once", async () => {
    // given
    mob1.withSkill(SkillType.Disarm, MAX_PRACTICE_LEVEL)

    // and
    mob2.equip(testRunner.createWeapon()
      .asMace()
      .build())

    // and
    await testRunner.fight(mob2.get())

    // when
    const responses = await testRunner.invokeSkillNTimes(iterations, SkillType.Disarm)

    // then
    expect(responses.filter(r => r.isSuccessful())).toHaveLength(1)
    expect(testRunner.getStartRoom().getItemCount()).toBe(1)
    expect(mob2.get().equipped.items).toHaveLength(0)
  })

  it("should succeed a reasonable number of times when practiced", async () => {
    // setup
    mob1.withSkill(SkillType.Disarm, MAX_PRACTICE_LEVEL * 0.75)
    await testRunner.fight(mob2.get())

    // when
    const responses = await doNTimes(iterations, () => {
      mob2.equip(testRunner.createWeapon()
        .asMace()
        .build())
      return testRunner.invokeAction(RequestType.Disarm)
    })

    // then
    expect(responses.filter(r => r.isSuccessful()).length)
      .toBeGreaterThan(iterations * 0.1)
  })

  it("should not work if not in a fight", async () => {
    // given
    mob1.withSkill(SkillType.Disarm, MAX_PRACTICE_LEVEL)

    // when
    const response = await testRunner.invokeAction(RequestType.Disarm)

    // then
    expect(response.isSuccessful()).toBeFalsy()
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.All.NoTarget)
  })

  it("should not work if the target is not armed", async () => {
    // given
    mob1.withSkill(SkillType.Disarm, MAX_PRACTICE_LEVEL)
    await testRunner.fight()

    // when
    const result = await testRunner.invokeAction(RequestType.Disarm)

    // then
    expect(result.isSuccessful()).toBeFalsy()
    expect(result.getMessageToRequestCreator()).toBe(ConditionMessages.Disarm.FailNothingToDisarm)
  })

  it("should not work if the mob is too tired", async () => {
    // setup
    const targetBuilder = (await testRunner.createMob())
      .equip(testRunner.createWeapon().asAxe().build())
    await testRunner.fight(targetBuilder.mob)

    // given
    mob1.setMv(0)
      .withSkill(SkillType.Disarm, MAX_PRACTICE_LEVEL)

    // when
    const response = await testRunner.invokeAction(RequestType.Disarm)

    // then
    expect(response.isSuccessful()).toBeFalsy()
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.All.NotEnoughMv)
  })

  it("succeeds or fails if all conditions are met", async () => {
    // setup
    mob1.withSkill(SkillType.Disarm, MAX_PRACTICE_LEVEL)
    const targetBuilder = (await testRunner.createMob())
      .equip(testRunner.createWeapon().asAxe().build())
    await testRunner.fight(targetBuilder.mob)

    // when
    const response = await testRunner.invokeAction(RequestType.Disarm)

    // then
    expect(response.isError()).toBeFalsy()
  })

  it("generates accurate messages", async () => {
    // setup
    mob1.withSkill(SkillType.Disarm, MAX_PRACTICE_LEVEL)
    const axe = testRunner.createWeapon().asAxe().build()
    const targetBuilder = (await testRunner.createMob())
      .equip(axe)
    await testRunner.fight(targetBuilder.mob)

    // when
    const response1 = await testRunner.invokeActionSuccessfully(RequestType.Disarm)

    // then
    expect(response1.getMessageToRequestCreator())
      .toBe(`you disarm ${targetBuilder.mob.name} and send its weapon flying!`)
    expect(response1.getMessageToTarget())
      .toBe(`${mob1.mob.name} disarms you and sends your weapon flying!`)
    expect(response1.getMessageToObservers())
      .toBe(`${mob1.mob.name} disarms ${targetBuilder.mob.name} and sends its weapon flying!`)

    // and
    targetBuilder.equip(axe)
    const response2 = await doNTimesOrUntilTruthy(iterations, async () => {
      const handled = await testRunner.invokeAction(RequestType.Disarm)
      if (handled.isSuccessful()) {
        targetBuilder.equip(axe)
      }
      return handled.isFailure() ? handled : null
    })
    expect(response2.getMessageToRequestCreator())
      .toBe(`you fail to disarm ${targetBuilder.mob.name}.`)
    expect(response2.getMessageToTarget())
      .toBe(`${mob1.mob.name} fails to disarm you.`)
    expect(response2.getMessageToObservers())
      .toBe(`${mob1.mob.name} fails to disarm ${targetBuilder.mob.name}.`)
  })
})
