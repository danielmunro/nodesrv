import {AffectType} from "../../../../affect/affectType"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import MobService from "../../../../mob/mobService"
import {RequestType} from "../../../../request/requestType"
import {SkillType} from "../../../../skill/skillType"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestBuilder from "../../../../support/test/testBuilder"

let testBuilder: TestBuilder
let mobService: MobService
let attacker: MobBuilder
let defender: MobBuilder

beforeEach(async () => {
  testBuilder = new TestBuilder()
  attacker = testBuilder.withMob()
    .withSkill(SkillType.EyeGouge, MAX_PRACTICE_LEVEL)
    .setLevel(30)
  defender = testBuilder.withMob()
  mobService = await testBuilder.getMobService()
})

describe("eye gouge skill action", () => {
  it("imparts blind affect", async () => {
    await testBuilder.successfulAction(
      testBuilder.createRequest(
        RequestType.EyeGouge,
        `eye ${defender.getMobName()}`,
        defender.mob))

    expect(defender.hasAffect(AffectType.Blind)).toBeTruthy()
  })

  it("causes a fight", async () => {
    await testBuilder.successfulAction(
      testBuilder.createRequest(
        RequestType.EyeGouge,
        `eye ${defender.getMobName()}`,
        defender.mob))

    expect(mobService.getFightCount()).toBe(1)
  })

  it("generates accurate success messages", async () => {
    const response = await testBuilder.successfulAction(
      testBuilder.createRequest(
        RequestType.EyeGouge,
        `eye ${defender.getMobName()}`,
        defender.mob))

    expect(response.getMessageToRequestCreator())
      .toBe(`you swipe your claws across ${defender.getMobName()}'s face, gouging their eyes!`)
    expect(response.message.getMessageToTarget())
      .toBe(`${attacker.getMobName()} swipes their claws across your face, gouging your eyes!`)
    expect(response.message.getMessageToObservers())
      .toBe(`${attacker.getMobName()} swipes their claws across ${defender.getMobName()}'s face, gouging their eyes!`)
  })
})
