import { AttackResult } from "../../mob/fight/attack"
import { Fight } from "../../mob/fight/fight"
import { Round } from "../../mob/fight/round"
import { getTestMob } from "../../test/mob"
import { newSkill } from "../factory"
import { SkillType } from "../skillType"

describe("dodge skill", () => {
  it("should be able to succeed and fail in a small collection of attempts", async () => {
    const attacker = getTestMob()
    attacker.skills.push(newSkill(SkillType.Dodge, 10))
    const defender = getTestMob()
    const fight = new Fight(attacker, defender, attacker.room)
    const results = []

    for (let i = 0; i < 20; i++) {
      results.push(await fight.round())
    }

    expect(results.every((r: Round) => {
      const lastAttack = r.getLastAttack()
      return lastAttack.result === AttackResult.Hit || lastAttack.result === AttackResult.Miss
    })).toBeTruthy()
    expect(results.some((r: Round) => r.getLastCounter().result === AttackResult.Dodge)).toBeTruthy()
    expect(results.some((r: Round) => r.getLastCounter().result === AttackResult.Hit)).toBeTruthy()
  })
})
