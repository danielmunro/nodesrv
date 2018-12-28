import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import { AttackResult } from "../../mob/fight/attack"
import doNTimes from "../../support/functional/times"
import TestBuilder from "../../test/testBuilder"
import { SkillType } from "../skillType"

const iterations = 10

describe("dodge skill", () => {
  it("should be able to succeed and fail in a small collection of attempts", async () => {
    // setup
    const testBuilder = new TestBuilder()

    // given
    const attacker = testBuilder.withMob()
    attacker.withLevel(20).withSkill(SkillType.Dodge, MAX_PRACTICE_LEVEL / 50)

    // and
    const fight = await testBuilder.fight(testBuilder.withMob().mob)

    // when
    const results = await doNTimes(iterations, () => fight.round())

    // then
    expect(results.some(r => r.getLastAttack().result === AttackResult.Dodge)).toBeTruthy()
    expect(results.some(r => r.getLastAttack().result === AttackResult.Hit)).toBeTruthy()
  })
})
