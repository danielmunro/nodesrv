import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import { getTestMob } from "../../test/mob"
import { getTestPlayer } from "../../test/player"
import { Costs } from "../constants"
import { CheckResult } from "../checkResult"
import { newSelfTargetAttempt, newSkill } from "../factory"
import { SkillType } from "../skillType"
import berserk from "./berserk"
import { Messages } from "./constants"

describe("berserk skill precondition", () => {
  it("should not allow berserking when preconditions fail", async () => {
    // given
    const mob = getTestMob()
    mob.vitals.mv = 0

    // when
    const check = await berserk(newSelfTargetAttempt(mob, newSkill(SkillType.Berserk)))

    // then
    expect(check.checkResult).toBe(CheckResult.Unable)
    expect(check.message).toBe(Messages.All.NotEnoughMv)
  })

  it("should not allow berserking if already berserked", async () => {
    // given
    const mob = getTestMob()
    mob.addAffect(newAffect(AffectType.Berserk, 1))

    // when
    const check = await berserk(newSelfTargetAttempt(mob, newSkill(SkillType.Berserk)))

    // then
    expect(check.checkResult).toBe(CheckResult.Unable)
    expect(check.message).toBe(Messages.Berserk.FailAlreadyInvoked)
  })

  it("should be able to apply the cost of berserking", async () => {
    // given
    const player = getTestPlayer()
    const mob = player.sessionMob
    const check = await berserk(newSelfTargetAttempt(mob, newSkill(SkillType.Berserk)))

    // when
    check.cost(player)

    // then
    expect(player.delay).toBe(Costs.Berserk.Delay)
    expect(mob.vitals.mv).toBeLessThan(mob.getCombinedAttributes().vitals.mv)
  })
})
