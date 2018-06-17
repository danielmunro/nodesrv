import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import { getTestMob } from "../../test/mob"
import { CheckResult } from "../checkResult"
import { newSelfTargetAttempt, newSkill } from "../factory"
import { SkillType } from "../skillType"
import berserk from "./berserk"

describe("berserk skill precondition", () => {
  it("should not allow berserking when preconditions fail", async () => {
    // given
    const mob = getTestMob()
    mob.vitals.mv = 0

    // when
    const check = await berserk(newSelfTargetAttempt(mob, newSkill(SkillType.Berserk)))

    // then
    expect(check.checkResult).toBe(CheckResult.Unable)
  })

  it("should not allow berserking if already berserked", async () => {
    // given
    const mob = getTestMob()
    mob.addAffect(newAffect(AffectType.Berserk, 1))

    // when
    const check = await berserk(newSelfTargetAttempt(mob, newSkill(SkillType.Berserk)))

    // then
    expect(check.checkResult).toBe(CheckResult.Unable)
  })
})
