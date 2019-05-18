import {AffectType} from "../../../../affect/enum/affectType"
import {createTestAppContainer} from "../../../../app/testFactory"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {RequestType} from "../../../../request/requestType"
import {SkillType} from "../../../../skill/skillType"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner
let attacker: MobBuilder
let target: MobBuilder

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  attacker = testRunner.createMob()
    .withSkill(SkillType.Garotte, MAX_PRACTICE_LEVEL)
    .setLevel(30)
  target = testRunner.createMob()
})

describe("garotte skill action", () => {
  it("imparts sleep affect", async () => {
    await testRunner.invokeActionSuccessfully(
        RequestType.Garotte,
        `garotte ${target.getMobName()}`,
        target.mob)

    expect(target.hasAffect(AffectType.Sleep)).toBeTruthy()
  })

  it("bounces off an orb of touch", async () => {
    // given
    target.addAffectType(AffectType.OrbOfTouch)

    // when
    const response = await testRunner.invokeAction(
      RequestType.Garotte,
      `garotte ${target.getMobName()}`,
      target.mob)

    // then
    expect(response.getMessageToRequestCreator())
      .toBe(`you bounce off of ${target.getMobName()}'s orb of touch.`)
    expect(response.getMessageToTarget())
      .toBe(`${attacker.getMobName()} bounces off of your orb of touch.`)
    expect(response.getMessageToObservers())
      .toBe(`${attacker.getMobName()} bounces off of ${target.getMobName()}'s orb of touch.`)
  })

  it("generates accurate success messages", async () => {
    const response = await testRunner.invokeActionSuccessfully(
        RequestType.Garotte,
        `garotte ${target.getMobName()}`,
        target.mob)

    expect(response.getMessageToRequestCreator()).toBe(`${target.getMobName()} passes out from suffocation.`)
    expect(response.getMessageToTarget()).toBe("you pass out from suffocation.")
    expect(response.getMessageToObservers()).toBe(`${target.getMobName()} passes out from suffocation.`)
  })

  it("generates accurate fail messages", async () => {
    const response = await testRunner.invokeActionFailure(
        RequestType.Garotte,
        `garotte ${target.getMobName()}`,
        target.mob)

    expect(response.getMessageToRequestCreator()).toBe(`you fail to sneak up on ${target.getMobName()}.`)
    expect(response.getMessageToTarget()).toBe(`${attacker.getMobName()} fails to sneak up on you.`)
    expect(response.getMessageToObservers())
      .toBe(`${attacker.getMobName()} fails to sneak up on ${target.getMobName()}.`)
  })
})
