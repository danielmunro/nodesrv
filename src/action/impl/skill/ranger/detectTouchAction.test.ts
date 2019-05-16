import {AffectType} from "../../../../affect/enum/affectType"
import {createTestAppContainer} from "../../../../app/testFactory"
import {RequestType} from "../../../../request/requestType"
import {SkillType} from "../../../../skill/skillType"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner
let mobBuilder: MobBuilder

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  mobBuilder = testRunner.createMob()
    .withSkill(SkillType.DetectTouch)
    .setLevel(30)
})

describe("detect touch skill action", () => {
  it("imparts the affect", async () => {
    // when
    await testRunner.invokeActionSuccessfully(RequestType.DetectTouch)

    // then
    expect(mobBuilder.hasAffect(AffectType.DetectTouch))
  })

  it("generates accurate success messages", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(RequestType.DetectTouch)

    // then
    expect(response.getMessageToRequestCreator()).toBe("you are adept to personal threats.")
    expect(response.getMessageToTarget()).toBe("you are adept to personal threats.")
    expect(response.getMessageToObservers())
      .toBe(`${mobBuilder.getMobName()} is adept to personal threats.`)
  })
})
