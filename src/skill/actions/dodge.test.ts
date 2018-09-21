import doNTimes from "../../functional/times"
import { AttackResult } from "../../mob/fight/attack"
import { Fight } from "../../mob/fight/fight"
import { getTestMob } from "../../test/mob"
import { newSkill } from "../factory"
import { SkillType } from "../skillType"

describe("dodge skill", () => {
  it("should be able to succeed and fail in a small collection of attempts", async () => {
    const attacker = getTestMob()
    attacker.skills.push(newSkill(SkillType.Dodge, 10))
    const defender = getTestMob()
    const fight = new Fight(attacker, defender, attacker.room)
    const results = await doNTimes(20, () => fight.round())

    expect(results.every(r => {
      const lastAttack = r.getLastAttack()
      return lastAttack.result === AttackResult.Hit || lastAttack.result === AttackResult.Miss
    })).toBeTruthy()
    expect(results.some(r => r.getLastCounter().result === AttackResult.Dodge)).toBeTruthy()
    expect(results.some(r => r.getLastCounter().result === AttackResult.Hit)).toBeTruthy()
  })
})
