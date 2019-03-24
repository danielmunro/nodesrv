import { MAX_PRACTICE_LEVEL } from "../../../../mob/constants"
import { AttackResult } from "../../../../mob/fight/attack"
import { SkillType } from "../../../../skill/skillType"
import doNTimes from "../../../../support/functional/times"
import TestBuilder from "../../../../test/testBuilder"

const iterations = 100

describe("dodge skill", () => {
  it("should be able to succeed and fail in a small collection of attempts", async () => {
    // setup
    const testBuilder = new TestBuilder()

    // given
    const attacker = testBuilder.withMob()
    attacker.setLevel(20).withSkill(SkillType.Dodge, MAX_PRACTICE_LEVEL)

    // and
    const fight = await testBuilder.fight()

    // when
    const results = await doNTimes(iterations, () => fight.round())

    // then
    expect(results.some(r => r.getLastAttack().result === AttackResult.Dodge)).toBeTruthy()
    expect(results.some(r => r.getLastAttack().result === AttackResult.Hit)).toBeTruthy()
  })
})
