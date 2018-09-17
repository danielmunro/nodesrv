import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import { Trigger } from "../../mob/trigger"
import { getTestMob } from "../../test/mob"
import { getTestPlayer } from "../../test/player"
import { Costs } from "../actions/constants"
import Attempt from "../attempt"
import AttemptContext from "../attemptContext"
import { CheckResult } from "../checkResult"
import { newSkill } from "../factory"
import { SkillType } from "../skillType"
import bash from "./bash"
import { MESSAGE_FAIL_NO_TARGET, MESSAGE_FAIL_TOO_TIRED } from "./constants"

describe("bash skill precondition", () => {
  it("should not allow bashing when too tired", async () => {
    // given
    const mob = getTestMob()
    const target = getTestMob()
    mob.vitals.mv = 0

    // when
    const check = await bash(
      new Attempt(mob, newSkill(SkillType.Bash, MAX_PRACTICE_LEVEL), new AttemptContext(Trigger.Input, target)))

    // then
    expect(check.checkResult).toBe(CheckResult.Unable)
    expect(check.message).toBe(MESSAGE_FAIL_TOO_TIRED)
  })

  it("should not allow bashing when a target is not provided", async () => {
    // given
    const mob = getTestMob()

    // when
    const check = await bash(
      new Attempt(mob, newSkill(SkillType.Bash, MAX_PRACTICE_LEVEL), new AttemptContext(Trigger.Input, mob)))

    // then
    expect(check.checkResult).toBe(CheckResult.Unable)
    expect(check.message).toBe(MESSAGE_FAIL_NO_TARGET)
  })

  it("should pass the check if all preconditions pass", async () => {
    // given
    const mob = getTestMob()
    const target = getTestMob()

    // when
    const check = await bash(
      new Attempt(mob, newSkill(SkillType.Bash, MAX_PRACTICE_LEVEL), new AttemptContext(Trigger.Input, target)))

    // then
    expect(check.checkResult).toBe(CheckResult.Able)
  })

  it("should be able to apply check costs", async () => {
    // given
    const player = getTestPlayer()
    const target = getTestMob()
    const check = await bash(
      new Attempt(
        player.sessionMob,
        newSkill(SkillType.Bash, MAX_PRACTICE_LEVEL),
        new AttemptContext(Trigger.Input, target)))
    const startingMv = player.sessionMob.vitals.mv
    const startingDelay = player.delay

    // when
    check.cost(player)

    // then
    expect(player.sessionMob.vitals.mv).toEqual(startingMv - Costs.Bash.Mv)
    expect(player.delay).toEqual(startingDelay + Costs.Bash.Delay)
  })
})
