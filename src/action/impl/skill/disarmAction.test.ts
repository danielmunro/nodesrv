import { MAX_PRACTICE_LEVEL } from "../../../mob/constants"
import { RequestType } from "../../../request/requestType"
import {ConditionMessages} from "../../../skill/constants"
import { SkillType } from "../../../skill/skillType"
import doNTimes from "../../../support/functional/times"
import MobBuilder from "../../../test/mobBuilder"
import TestBuilder from "../../../test/testBuilder"
import Action from "../../action"

const iterations = 1000
let testBuilder: TestBuilder
let action: Action
let mob1: MobBuilder
let mob2: MobBuilder

beforeEach(async () => {
  testBuilder = new TestBuilder()
  mob1 = testBuilder.withMob()
  mob1.withLevel(50)
  mob2 = testBuilder.withMob()
  mob2.withLevel(50)
  action = await testBuilder.getActionDefinition(RequestType.Disarm)
})

describe("disarm skill action", () => {
  it("should disarm the equipped weapon onto the ground only once", async () => {
    // given
    mob1.withSkill(SkillType.Disarm, MAX_PRACTICE_LEVEL)

    // and
    mob2.equip().withMaceEq()

    // and
    await testBuilder.fight(mob2.mob)

    // when
    const responses = await doNTimes(iterations, () =>
      action.handle(testBuilder.createRequest(RequestType.Disarm, "disarm", mob2.mob)))

    // then
    expect(responses.filter(r => r.isSuccessful())).toHaveLength(1)
    expect(testBuilder.room.inventory.items).toHaveLength(1)
    expect(mob2.mob.equipped.items).toHaveLength(0)
  })

  it("should succeed a reasonable number of times when practiced", async () => {
    // setup
    mob1.withSkill(SkillType.Disarm, MAX_PRACTICE_LEVEL * 0.75)
    await testBuilder.fight(mob2.mob)

    // when
    const responses = await doNTimes(iterations, () => {
      mob2.equip().withMaceEq()
      return action.handle(testBuilder.createRequest(RequestType.Disarm))
    })

    // then
    expect(responses.filter(r => r.isSuccessful()).length).toBeGreaterThan(iterations * 0.1)
  })

  it("should not work if not in a fight", async () => {
    // given
    mob1.withSkill(SkillType.Disarm, MAX_PRACTICE_LEVEL)

    // when
    const result = await action.handle(testBuilder.createRequest(RequestType.Disarm))

    // then
    expect(result.isSuccessful()).toBeFalsy()
    expect(result.message.getMessageToRequestCreator()).toBe(ConditionMessages.All.NoTarget)
  })

  it("should not work if the target is not armed", async () => {
    // given
    mob1.withSkill(SkillType.Disarm, MAX_PRACTICE_LEVEL)

    // setup
    await testBuilder.fight()

    // when
    const result = await action.handle(testBuilder.createRequest(RequestType.Disarm))

    // then
    expect(result.isSuccessful()).toBeFalsy()
    expect(result.message.getMessageToRequestCreator()).toBe(ConditionMessages.Disarm.FailNothingToDisarm)
  })

  it("should not work if the mob is too tired", async () => {
    // setup
    mob1.withSkill(SkillType.Disarm, MAX_PRACTICE_LEVEL)
    const targetBuilder = testBuilder.withMob()
    targetBuilder.equip().withAxeEq()
    await testBuilder.fight(targetBuilder.mob)

    // given
    mob1.mob.vitals.mv = 0

    // when
    const response = await action.handle(testBuilder.createRequest(RequestType.Disarm))

    // then
    expect(response.isSuccessful()).toBeFalsy()
    expect(response.message.getMessageToRequestCreator()).toBe(ConditionMessages.All.NotEnoughMv)
  })

  it("should succeed if all conditions are met", async () => {
    // setup
    mob1.withSkill(SkillType.Disarm, MAX_PRACTICE_LEVEL)
    const targetBuilder = testBuilder.withMob()
    targetBuilder.equip().withAxeEq()
    await testBuilder.fight(targetBuilder.mob)

    // when
    const response = await action.handle(testBuilder.createRequest(RequestType.Disarm))

    // then
    expect(response.isError()).toBeFalsy()
  })

  it("generates accurate messages", async () => {
    // setup
    mob1.withSkill(SkillType.Disarm, MAX_PRACTICE_LEVEL)
    const targetBuilder = testBuilder.withMob()
    targetBuilder.equip().withAxeEq()
    await testBuilder.fight(targetBuilder.mob)

    // when
    const responses = await doNTimes(iterations, () => action.handle(testBuilder.createRequest(RequestType.Disarm)))

    // then
    const successMessage = responses.find(response => response.isSuccessful()).message
    expect(successMessage.getMessageToRequestCreator())
      .toBe(`you disarm ${targetBuilder.mob.name} and send its weapon flying!`)
    expect(successMessage.getMessageToTarget())
      .toBe(`${mob1.mob.name} disarms you and sends your weapon flying!`)
    expect(successMessage.getMessageToObservers())
      .toBe(`${mob1.mob.name} disarms ${targetBuilder.mob.name} and sends its weapon flying!`)

    // and
    const failMessage = responses.find(response => !response.isSuccessful()).message
    expect(failMessage.getMessageToRequestCreator())
      .toBe(`you fail to disarm ${targetBuilder.mob.name}.`)
    expect(failMessage.getMessageToTarget())
      .toBe(`${mob1.mob.name} fails to disarm you.`)
    expect(failMessage.getMessageToObservers())
      .toBe(`${mob1.mob.name} fails to disarm ${targetBuilder.mob.name}.`)
  })
})
