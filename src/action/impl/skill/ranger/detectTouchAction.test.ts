import {AffectType} from "../../../../affect/affectType"
import {RequestType} from "../../../../request/requestType"
import {SkillType} from "../../../../skill/skillType"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestBuilder from "../../../../support/test/testBuilder"

let testBuilder: TestBuilder
let mobBuilder: MobBuilder

beforeEach(() => {
  testBuilder = new TestBuilder()
  mobBuilder = testBuilder.withMob().withSkill(SkillType.DetectTouch).setLevel(30)
})

describe("detect touch skill action", () => {
  it("imparts the affect", async () => {
    // when
    await testBuilder.successfulAction(
      testBuilder.createRequest(RequestType.DetectTouch))

    // then
    expect(mobBuilder.hasAffect(AffectType.DetectTouch))
  })

  it("generates accurate success messages", async () => {
    // when
    const response = await testBuilder.successfulAction(
      testBuilder.createRequest(RequestType.DetectTouch))

    // then
    expect(response.getMessageToRequestCreator()).toBe("you are adept to personal threats.")
    expect(response.message.getMessageToTarget()).toBe("you are adept to personal threats.")
    expect(response.message.getMessageToObservers())
      .toBe(`${mobBuilder.getMobName()} is adept to personal threats.`)
  })
})
