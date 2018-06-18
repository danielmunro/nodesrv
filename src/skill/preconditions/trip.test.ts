import { getTestMob } from "../../test/mob"
import { getTestPlayer } from "../../test/player"
import Attempt from "../attempt"
import { CheckResult } from "../checkResult"
import { newSkill } from "../factory"
import { SkillType } from "../skillType"
import trip, { COST_DELAY, COST_MV, MESSAGE_FAIL_TOO_TIRED } from "./trip"

describe("trip skill precondition", () => {
  it("should not work if the mob is out of movement", async () => {
    // given
    const player = getTestPlayer()
    const target = getTestMob()
    player.sessionMob.vitals.mv = 0

    // when
    const check = await trip(new Attempt(player.sessionMob, target, newSkill(SkillType.Trip)))

    // then
    expect(check.checkResult).toBe(CheckResult.Unable)
    expect(check.message).toBe(MESSAGE_FAIL_TOO_TIRED)
  })

  it("should apply costs", async () => {
    // given
    const player = getTestPlayer()
    const target = getTestMob()

    // when
    const check = await trip(new Attempt(player.sessionMob, target, newSkill(SkillType.Trip)))

    // then
    expect(check.checkResult).toBe(CheckResult.Able)

    // when
    check.cost(player)

    // then
    expect(player.sessionMob.vitals.mv).toBe(player.sessionMob.getCombinedAttributes().vitals.mv - COST_MV)
    expect(player.delay).toBe(COST_DELAY)
  })
})
