import {AffectType} from "../../../../affect/enum/affectType"
import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {RequestType} from "../../../../messageExchange/enum/requestType"
import Response from "../../../../messageExchange/response"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {SkillType} from "../../../../mob/skill/skillType"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

const iterations = 100
let testRunner: TestRunner
let mobBuilder: MobBuilder

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  mobBuilder = (await testRunner.createMob())
    .setLevel(20)
})

describe("dirt kick skill action", () => {
  it("fails often when not practiced", async () => {
    // given
    mobBuilder.withSkill(SkillType.DirtKick)

    // when
    const responses = await testRunner.invokeSkillNTimes(iterations, SkillType.DirtKick)

    // then
    expect(responses.filter((r: Response) => !r.isSuccessful()).length).toBeGreaterThan(iterations * 0.9)
  })

  it("succeeds when practiced", async () => {
    // given
    mobBuilder.withSkill(SkillType.DirtKick, MAX_PRACTICE_LEVEL)
    const opponent = await testRunner.createMob()
    await testRunner.fight(opponent.get())

    // when
    await testRunner.invokeActionSuccessfully(RequestType.DirtKick)

    // then
    expect(opponent.hasAffect(AffectType.Blind)).toBeTruthy()
  })

  it("does not stack blind affects", async () => {
    // given
    mobBuilder.withSkill(SkillType.DirtKick, MAX_PRACTICE_LEVEL)
    const opponent = await testRunner.createMob()
    await testRunner.fight(opponent.get())

    // when
    const responses = await testRunner.invokeSkillNTimes(iterations, SkillType.DirtKick)

    // then
    expect(responses.some(r => r.isSuccessful())).toBeTruthy()
    expect(opponent.get().affects).toHaveLength(1)
  })

  it("generates accurate messages", async () => {
    // given
    mobBuilder.withSkill(SkillType.DirtKick, MAX_PRACTICE_LEVEL)
    const opponent = await testRunner.createMob()
    await testRunner.fight(opponent.get())

    // when
    const response = await testRunner.invokeActionSuccessfully(RequestType.DirtKick)

    // then
    expect(response.getMessageToRequestCreator())
      .toBe(`you kick dirt right in ${opponent.getMobName()}'s eyes!`)
    expect(response.getMessageToTarget())
      .toBe(`${mobBuilder.getMobName()} kicks dirt right in your eyes!`)
    expect(response.getMessageToObservers())
      .toBe(`${mobBuilder.getMobName()} kicks dirt right in ${opponent.getMobName()}'s eyes!`)
  })
})
