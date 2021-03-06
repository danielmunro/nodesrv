import {AffectType} from "../../../../affect/enum/affectType"
import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {RequestType} from "../../../../messageExchange/enum/requestType"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {SkillType} from "../../../../mob/skill/skillType"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner
let mob: MobBuilder

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  mob = (await testRunner.createMob()).withSkill(SkillType.Endurance, MAX_PRACTICE_LEVEL)
})

describe("endurance action", () => {
  it("imparts the affect when applied", async () => {
    // when
    await testRunner.invokeSkill(SkillType.Endurance)

    // then
    expect(mob.hasAffect(AffectType.Endurance))
  })

  it("generates accurate success messages", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(RequestType.Endurance)

    // then
    expect(response.getMessageToRequestCreator()).toBe("you feel strong and invigorated.")
    expect(response.getMessageToTarget()).toBe("you feel strong and invigorated.")
    expect(response.getMessageToObservers()).toBe(`${mob.getMobName()} looks strong and invigorated.`)
  })
})
