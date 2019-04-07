import { MAX_PRACTICE_LEVEL } from "../../../../mob/constants"
import { RequestType } from "../../../../request/requestType"
import Response from "../../../../request/response"
import { SkillType } from "../../../../skill/skillType"
import doNTimes from "../../../../support/functional/times"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestBuilder from "../../../../support/test/testBuilder"

const iterations = 100
let testBuilder: TestBuilder
let mobBuilder: MobBuilder

beforeEach(async () => {
  testBuilder = new TestBuilder()
  mobBuilder = testBuilder.withMob().setLevel(20)
})

describe("dirt kick skill action", () => {
  it("should fail when not practiced", async () => {
    // given
    mobBuilder.withSkill(SkillType.DirtKick)
    await testBuilder.fight()

    // when
    const responses = await doNTimes(iterations, () =>
      testBuilder.handleAction(RequestType.DirtKick))

    // then
    expect(responses.filter((r: Response) => !r.isSuccessful()).length).toBeGreaterThan(iterations * 0.9)
  })

  it("should succeed when practiced", async () => {
    // given
    mobBuilder.withSkill(SkillType.DirtKick, MAX_PRACTICE_LEVEL)
    const opponent = testBuilder.withMob()
    await testBuilder.fight(opponent.mob)

    // when
    const responses = await doNTimes(iterations, () =>
      testBuilder.handleAction(RequestType.DirtKick))

    // then
    expect(responses.some(r => r.isSuccessful())).toBeTruthy()
    expect(opponent.mob.affect().isBlind()).toBeTruthy()
  })

  it("should not be able to stack blind affects", async () => {
    // given
    mobBuilder.withSkill(SkillType.DirtKick, MAX_PRACTICE_LEVEL)
    const opponent = testBuilder.withMob()
    await testBuilder.fight(opponent.mob)

    // when
    const responses = await doNTimes(iterations, () =>
      testBuilder.handleAction(RequestType.DirtKick))

    // then
    expect(responses.some(r => r.isSuccessful())).toBeTruthy()
    expect(opponent.mob.affects).toHaveLength(1)
  })

  it("generates accurate messages", async () => {
    // given
    mobBuilder.withSkill(SkillType.DirtKick, MAX_PRACTICE_LEVEL)
    const opponent = testBuilder.withMob()
    await testBuilder.fight(opponent.mob)

    // when
    const responses = await doNTimes(iterations, () =>
      testBuilder.handleAction(RequestType.DirtKick))

    // then
    const successResponse = responses.find(response => response.isSuccessful()).message
    expect(successResponse.getMessageToRequestCreator())
      .toBe(`you kick dirt right in ${opponent.getMobName()}'s eyes!`)
    expect(successResponse.getMessageToTarget())
      .toBe(`${mobBuilder.getMobName()} kicks dirt right in your eyes!`)
    expect(successResponse.getMessageToObservers())
      .toBe(`${mobBuilder.getMobName()} kicks dirt right in ${opponent.getMobName()}'s eyes!`)
  })
})
