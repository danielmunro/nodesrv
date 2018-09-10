import { getTestMob } from "../../test/mob"
import { newSkill } from "../factory"
import { SkillType } from "../skillType"
import { Fight } from "../../mob/fight/fight"
import doNTimes from "../../functional/times"

const MAX_SKILL_LEVEL = 100

describe("second attacks skill action", () => {
  it("should invoke a second attacks", async () => {
    const mob = getTestMob()
    mob.skills.push(newSkill(SkillType.SecondAttack, MAX_SKILL_LEVEL))
    const target = getTestMob()

    const fight = new Fight(mob, target)
    const rounds = await Promise.all(doNTimes(10, () => fight.round()))

    expect(rounds.find((round) => round.attacks.length > 1)).not.toBeUndefined()
  })
})
