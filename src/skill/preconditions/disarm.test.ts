import { addFight, Fight } from "../../mob/fight/fight"
import { Trigger } from "../../mob/trigger"
import { format } from "../../support/string"
import TestBuilder from "../../test/testBuilder"
import Attempt from "../attempt"
import AttemptContext from "../attemptContext"
import { CheckResult } from "../checkResult"
import { SkillType } from "../skillType"
import { Messages } from "./constants"
import disarm from "./disarm"

describe("disarm preconditions", () => {
  it("should not work if not in a fight", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer()
    const mob = playerBuilder.player.sessionMob
    const skill = playerBuilder.withSkill(SkillType.Disarm)

    // when
    const outcome = await disarm(new Attempt(mob, skill, new AttemptContext(Trigger.None, mob)))

    // then
    expect(outcome.checkResult).toBe(CheckResult.Unable)
    expect(outcome.message).toBe(Messages.All.NoTarget)
  })

  it("should not work if the target is not armed", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer()
    const target = testBuilder.withMob().mob
    const mob = playerBuilder.player.sessionMob
    const skill = playerBuilder.withSkill(SkillType.Disarm)
    addFight(new Fight(mob, target, testBuilder.room))

    // when
    const outcome = await disarm(new Attempt(mob, skill, new AttemptContext(Trigger.None, mob)))

    // then
    expect(outcome.checkResult).toBe(CheckResult.Unable)
    expect(outcome.message).toBe(format(Messages.Disarm.FailNothingToDisarm, mob.name))
  })

  it("should not work if the mob is too tired", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer()
    const targetBuilder = testBuilder.withMob()
    targetBuilder.equip().withAxeEq()
    const target = targetBuilder.mob
    const mob = playerBuilder.player.sessionMob
    const skill = playerBuilder.withSkill(SkillType.Disarm)
    addFight(new Fight(mob, target, testBuilder.room))

    // given
    mob.vitals.mv = 0

    // when
    const outcome = await disarm(new Attempt(mob, skill, new AttemptContext(Trigger.None, target)))

    // then
    expect(outcome.checkResult).toBe(CheckResult.Unable)
    expect(outcome.message).toBe(Messages.All.NotEnoughMv)
  })

  it("should succeed if all conditions are met", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer()
    const targetBuilder = testBuilder.withMob()
    targetBuilder.equip().withAxeEq()
    const target = targetBuilder.mob
    const mob = playerBuilder.player.sessionMob
    const skill = playerBuilder.withSkill(SkillType.Disarm)
    addFight(new Fight(mob, target, testBuilder.room))

    // when
    const outcome = await disarm(new Attempt(mob, skill, new AttemptContext(Trigger.None, target)))

    // then
    expect(outcome.checkResult).toBe(CheckResult.Able)
  })
})
