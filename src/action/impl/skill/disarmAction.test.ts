import { MAX_PRACTICE_LEVEL } from "../../../mob/constants"
import { RequestType } from "../../../request/requestType"
import {ConditionMessages} from "../../../skill/constants"
import { SkillType } from "../../../skill/skillType"
import doNTimes, {doNTimesOrUntilTruthy, getSuccessfulAction} from "../../../support/functional/times"
import MobBuilder from "../../../test/mobBuilder"
import TestBuilder from "../../../test/testBuilder"

const iterations = 1000
let testBuilder: TestBuilder
let mob1: MobBuilder
let mob2: MobBuilder

function equipMaceToMob(mobBuilder: MobBuilder) {
  testBuilder.withWeapon()
    .asMace()
    .equipToMobBuilder(mobBuilder)
    .build()
}

beforeEach(async () => {
  testBuilder = new TestBuilder()
  mob1 = testBuilder.withMob().withLevel(50)
  mob2 = testBuilder.withMob().withLevel(50)
})

describe("disarm skill action", () => {
  it("should disarm the equipped weapon onto the ground only once", async () => {
    // given
    mob1.withSkill(SkillType.Disarm, MAX_PRACTICE_LEVEL)

    // and
    equipMaceToMob(mob2)

    // and
    await testBuilder.fight(mob2.mob)

    // when
    const responses = await doNTimes(iterations, () =>
      testBuilder.handleAction(RequestType.Disarm, "disarm"))

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
      equipMaceToMob(mob2)
      return testBuilder.handleAction(RequestType.Disarm)
    })

    // then
    expect(responses.filter(r => r.isSuccessful()).length)
      .toBeGreaterThan(iterations * 0.1)
  })

  it("should not work if not in a fight", async () => {
    // given
    mob1.withSkill(SkillType.Disarm, MAX_PRACTICE_LEVEL)

    // when
    const result = await testBuilder.handleAction(RequestType.Disarm)

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
    const result = await testBuilder.handleAction(RequestType.Disarm)

    // then
    expect(result.isSuccessful()).toBeFalsy()
    expect(result.message.getMessageToRequestCreator()).toBe(ConditionMessages.Disarm.FailNothingToDisarm)
  })

  it("should not work if the mob is too tired", async () => {
    // setup
    const targetBuilder = testBuilder.withMob()
    equipMaceToMob(targetBuilder)
    await testBuilder.fight(targetBuilder.mob)

    // given
    mob1.withMv(0)
      .withSkill(SkillType.Disarm, MAX_PRACTICE_LEVEL)

    // when
    const response = await testBuilder.handleAction(RequestType.Disarm)

    // then
    expect(response.isSuccessful()).toBeFalsy()
    expect(response.message.getMessageToRequestCreator()).toBe(ConditionMessages.All.NotEnoughMv)
  })

  it("should succeed if all conditions are met", async () => {
    // setup
    mob1.withSkill(SkillType.Disarm, MAX_PRACTICE_LEVEL)
    const targetBuilder = testBuilder.withMob()
    equipMaceToMob(targetBuilder)
    await testBuilder.fight(targetBuilder.mob)

    // when
    const response = await testBuilder.handleAction(RequestType.Disarm)

    // then
    expect(response.isError()).toBeFalsy()
  })

  it("generates accurate messages", async () => {
    // setup
    mob1.withSkill(SkillType.Disarm, MAX_PRACTICE_LEVEL)
    const targetBuilder = testBuilder.withMob()
    equipMaceToMob(targetBuilder)
    await testBuilder.fight(targetBuilder.mob)
    const action = await testBuilder.getAction(RequestType.Disarm)

    // when
    const response1 = await getSuccessfulAction(action, testBuilder.createRequest(RequestType.Disarm))

    // then
    expect(response1.message.getMessageToRequestCreator())
      .toBe(`you disarm ${targetBuilder.mob.name} and send its weapon flying!`)
    expect(response1.message.getMessageToTarget())
      .toBe(`${mob1.mob.name} disarms you and sends your weapon flying!`)
    expect(response1.message.getMessageToObservers())
      .toBe(`${mob1.mob.name} disarms ${targetBuilder.mob.name} and sends its weapon flying!`)

    // and
    equipMaceToMob(targetBuilder)
    const response2 = await doNTimesOrUntilTruthy(iterations, async () => {
      const handled = await testBuilder.handleAction(RequestType.Disarm)
      return handled.isFailure() ? handled : null
    })
    expect(response2.message.getMessageToRequestCreator())
      .toBe(`you fail to disarm ${targetBuilder.mob.name}.`)
    expect(response2.message.getMessageToTarget())
      .toBe(`${mob1.mob.name} fails to disarm you.`)
    expect(response2.message.getMessageToObservers())
      .toBe(`${mob1.mob.name} fails to disarm ${targetBuilder.mob.name}.`)
  })
})
