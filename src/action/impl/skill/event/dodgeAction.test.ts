import {createTestAppContainer} from "../../../../app/factory/testFactory"
import { MAX_PRACTICE_LEVEL } from "../../../../mob/constants"
import {AttackResult} from "../../../../mob/fight/enum/attackResult"
import { SkillType } from "../../../../skill/skillType"
import doNTimes from "../../../../support/functional/times"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

const iterations = 100

describe("dodge skill", () => {
  it("should be able to succeed and fail in a small collection of attempts", async () => {
    // setup
    const testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)

    // given
    testRunner.createMob()
      .setLevel(20)
      .withSkill(SkillType.Dodge, MAX_PRACTICE_LEVEL)

    // and
    const fight = testRunner.fight(testRunner.createMob().get())

    // when
    const results = await doNTimes(iterations, () => fight.round())

    // then
    expect(results.some(r => r.getLastAttack().result === AttackResult.Dodge)).toBeTruthy()
    expect(results.some(r => r.getLastAttack().result === AttackResult.Hit)).toBeTruthy()
  })
})
