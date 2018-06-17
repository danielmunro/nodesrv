import { getTestMob } from "../../test/mob"
import Attempt from "../attempt"
import { CheckResult } from "../checkResult"
import { newSkill } from "../factory"
import { SkillType } from "../skillType"
import bash from "./bash"

describe("bash skill precondition", () => {
  it("should not allow bashing when preconditions fail", async () => {
    // given
    const mob = getTestMob()
    const target = getTestMob()
    mob.vitals.mv = 0

    // when
    const check = await bash(new Attempt(mob, target, newSkill(SkillType.Bash, 100)))

    // then
    expect(check.checkResult).toBe(CheckResult.Unable)
  })

  it("should not allow bashing when a target is not provided", async () => {
    // given
    const mob = getTestMob()

    // when
    const check = await bash(new Attempt(mob, mob, newSkill(SkillType.Bash, 100)))

    // then
    expect(check.checkResult).toBe(CheckResult.Unable)
  })

  it("should pass the check if all preconditions pass", async () => {
    // given
    const mob = getTestMob()
    const target = getTestMob()

    // when
    const check = await bash(new Attempt(mob, target, newSkill(SkillType.Bash, 100)))

    // then
    expect(check.checkResult).toBe(CheckResult.Able)
  })
})
