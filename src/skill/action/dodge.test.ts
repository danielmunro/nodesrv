import doNTimes from "../../support/functional/times"
import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import { AttackResult } from "../../mob/fight/attack"
import TestBuilder from "../../test/testBuilder"
import { SkillType } from "../skillType"

const iterations = 10

describe("dodge skill", () => {
  it("should be able to succeed and fail in a small collection of attempts", async () => {
    const testBuilder = new TestBuilder()
    const attacker = testBuilder.withMob()
    attacker.withLevel(20).withSkill(SkillType.Dodge, MAX_PRACTICE_LEVEL / 50)
    const defender = testBuilder.withMob()
    const fight = await testBuilder.fight(defender.mob)
    const results = await doNTimes(iterations, () => fight.round())

    expect(results.filter(r => r).every(r => {
      const lastAttack = r.getLastAttack()
      return lastAttack.result === AttackResult.Hit || lastAttack.result === AttackResult.Miss
    })).toBeTruthy()

    expect(results.some(r => r.getLastCounter().result === AttackResult.Dodge)).toBeTruthy()
    expect(results.some(r => r.getLastCounter().result === AttackResult.Hit)).toBeTruthy()
  })
})
