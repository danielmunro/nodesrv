import { MaxPracticeLevel } from "../../mob/model/mob"
import { getTestMob } from "../../test/mob"
import { getTestPlayer } from "../../test/player"
import Attempt from "../attempt"
import { CheckResult } from "../checkResult"
import { newSkill } from "../factory"
import { SkillType } from "../skillType"
import bash, { COST_DELAY, COST_MV, MESSAGE_FAIL_NO_TARGET, MESSAGE_FAIL_TOO_TIRED } from "./bash"

describe("bash skill precondition", () => {
  it("should not allow bashing when too tired", async () => {
    // given
    const mob = getTestMob()
    const target = getTestMob()
    mob.vitals.mv = 0

    // when
    const check = await bash(new Attempt(mob, target, newSkill(SkillType.Bash, MaxPracticeLevel)))

    // then
    expect(check.checkResult).toBe(CheckResult.Unable)
    expect(check.message).toBe(MESSAGE_FAIL_TOO_TIRED)
  })

  it("should not allow bashing when a target is not provided", async () => {
    // given
    const mob = getTestMob()

    // when
    const check = await bash(new Attempt(mob, mob, newSkill(SkillType.Bash, MaxPracticeLevel)))

    // then
    expect(check.checkResult).toBe(CheckResult.Unable)
    expect(check.message).toBe(MESSAGE_FAIL_NO_TARGET)
  })

  it("should pass the check if all preconditions pass", async () => {
    // given
    const mob = getTestMob()
    const target = getTestMob()

    // when
    const check = await bash(new Attempt(mob, target, newSkill(SkillType.Bash, MaxPracticeLevel)))

    // then
    expect(check.checkResult).toBe(CheckResult.Able)
  })

  it("should be able to apply check costs", async () => {
    // given
    const player = getTestPlayer()
    const target = getTestMob()
    const check = await bash(new Attempt(player.sessionMob, target, newSkill(SkillType.Bash, MaxPracticeLevel)))
    const startingMv = player.sessionMob.vitals.mv
    const startingDelay = player.delay

    // when
    check.cost(player)

    // then
    expect(player.sessionMob.vitals.mv).toEqual(startingMv - COST_MV)
    expect(player.delay).toEqual(startingDelay + COST_DELAY)
  })
})
