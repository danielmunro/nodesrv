import {createTestAppContainer} from "../../../../app/factory/testFactory"
import { MAX_PRACTICE_LEVEL } from "../../../../mob/constants"
import {AttackResult} from "../../../../mob/fight/enum/attackResult"
import { SkillType } from "../../../../mob/skill/skillType"
import doNTimes from "../../../../support/functional/times"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

const iterations = 1000

describe("dodge skill", () => {
  it("should be able to succeed and fail in a small collection of attempts", async () => {
    // setup
    const testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)

    // given
    const mob1 = testRunner.createMob()
      .setLevel(20)
      .withSkill(SkillType.Dodge, MAX_PRACTICE_LEVEL)
    const mob2 = testRunner.createMob()

    // and
    const fight = testRunner.fight(mob2.get())

    // when
    const results = await doNTimes(iterations, async () => {
      mob1.setHp(20)
      mob2.setHp(20)
      return fight.round()
    })

    // then
    expect(results.some(r => r.getLastAttack().result === AttackResult.Dodge)).toBeTruthy()
    expect(results.some(r => r.getLastAttack().result === AttackResult.Hit)).toBeTruthy()
  })
})
