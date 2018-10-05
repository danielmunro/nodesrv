import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import { CheckStatus } from "../../check/checkStatus"
import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import { SkillType } from "../skillType"
import berserk from "./berserk"
import { Messages } from "./constants"

describe("berserk skill precondition", () => {
  it("should not allow berserking when preconditions fail", async () => {
    // setup
    const testBuilder = new TestBuilder()

    // given
    const playerBuilder = await testBuilder.withPlayer(p => p.sessionMob.vitals.mv = 0)
    playerBuilder.withSkill(SkillType.Berserk)

    // when
    const check = await berserk(testBuilder.createRequest(RequestType.Berserk))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(Messages.All.NotEnoughMv)
  })

  it("should not allow berserking if already berserked", async () => {
    // setup
    const testBuilder = new TestBuilder()

    // given
    const playerBuilder = await testBuilder.withPlayer(p => p.sessionMob.addAffect(newAffect(AffectType.Berserk)))
    playerBuilder.withSkill(SkillType.Berserk, MAX_PRACTICE_LEVEL)

    // when
    const check = await berserk(testBuilder.createRequest(RequestType.Berserk))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(Messages.Berserk.FailAlreadyInvoked)
  })

  it("should be able to get a success check if conditions met", async () => {
    // setup
    const testBuilder = new TestBuilder()

    // given
    const playerBuilder = await testBuilder.withPlayer()
    playerBuilder.withSkill(SkillType.Berserk, MAX_PRACTICE_LEVEL)

    // when
    const check = await berserk(testBuilder.createRequest(RequestType.Berserk))

    // then
    expect(check.status).toBe(CheckStatus.Ok)
  })
})
