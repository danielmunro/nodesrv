import {AffectType} from "../../../../affect/affectType"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {RequestType} from "../../../../request/requestType"
import {SkillType} from "../../../../skill/skillType"
import {getFailureAction} from "../../../../support/functional/times"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestBuilder from "../../../../support/test/testBuilder"

let testBuilder: TestBuilder
let attacker: MobBuilder
let target: MobBuilder

beforeEach(() => {
  testBuilder = new TestBuilder()
  attacker = testBuilder.withMob().withSkill(SkillType.Garotte, MAX_PRACTICE_LEVEL).setLevel(30)
  target = testBuilder.withMob()
})

describe("garotte skill action", () => {
  it("imparts sleep affect", async () => {
    await testBuilder.successfulAction(
      testBuilder.createRequest(
        RequestType.Garotte,
        `garotte ${target.getMobName()}`,
        target.mob))

    expect(target.hasAffect(AffectType.Sleep)).toBeTruthy()
  })

  it("bounces off an orb of touch", async () => {
    // given
    target.addAffectType(AffectType.OrbOfTouch)

    // when
    const response = await testBuilder.handleAction(
      RequestType.Garotte,
      `garotte ${target.getMobName()}`,
      target.mob)

    // then
    expect(response.message.getMessageToRequestCreator())
      .toBe(`you bounce off of ${target.getMobName()}'s orb of touch.`)
    expect(response.message.getMessageToTarget())
      .toBe(`${attacker.getMobName()} bounces off of your orb of touch.`)
    expect(response.message.getMessageToObservers())
      .toBe(`${attacker.getMobName()} bounces off of ${target.getMobName()}'s orb of touch.`)
  })

  it("generates accurate success messages", async () => {
    const response = await testBuilder.successfulAction(
      testBuilder.createRequest(
        RequestType.Garotte,
        `garotte ${target.getMobName()}`,
        target.mob))

    expect(response.getMessageToRequestCreator()).toBe(`${target.getMobName()} passes out from suffocation.`)
    expect(response.message.getMessageToTarget()).toBe("you pass out from suffocation.")
    expect(response.message.getMessageToObservers()).toBe(`${target.getMobName()} passes out from suffocation.`)
  })

  it("generates accurate fail messages", async () => {
    const response = await getFailureAction(
      await testBuilder.getAction(RequestType.Garotte),
      testBuilder.createRequest(
        RequestType.Garotte,
        `garotte ${target.getMobName()}`,
        target.mob))

    expect(response.getMessageToRequestCreator()).toBe(`you fail to sneak up on ${target.getMobName()}.`)
    expect(response.message.getMessageToTarget()).toBe(`${attacker.getMobName()} fails to sneak up on you.`)
    expect(response.message.getMessageToObservers())
      .toBe(`${attacker.getMobName()} fails to sneak up on ${target.getMobName()}.`)
  })
})
