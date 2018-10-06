import doNTimes from "../../functional/times"
import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import { AttackResult } from "../../mob/fight/attack"
import { addFight, Fight, reset } from "../../mob/fight/fight"
import TestBuilder from "../../test/testBuilder"
import { SkillType } from "../skillType"

describe("dodge skill", () => {
  beforeEach(() => reset())
  it("should be able to succeed and fail in a small collection of attempts", async () => {
    const testBuilder = new TestBuilder()
    const attacker = testBuilder.withMob()
    attacker.withSkill(SkillType.Dodge, MAX_PRACTICE_LEVEL / 50)
    const defender = testBuilder.withMob()
    const fight = new Fight(attacker.mob, defender.mob, testBuilder.room)
    addFight(fight)
    const results = await doNTimes(10, () => fight.isInProgress() ? fight.round() : null)

    expect(results.filter(r => r).every(r => {
      const lastAttack = r.getLastAttack()
      return lastAttack.result === AttackResult.Hit || lastAttack.result === AttackResult.Miss
    })).toBeTruthy()
    expect(results.some(r => r.getLastCounter().result === AttackResult.Dodge)).toBeTruthy()
    expect(results.some(r => r.getLastCounter().result === AttackResult.Hit)).toBeTruthy()
  })
})
