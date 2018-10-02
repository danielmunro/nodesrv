import { AffectType } from "../../affect/affectType"
import CheckedRequest from "../../check/checkedRequest"
import doNTimes from "../../functional/times"
import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import berserkPrecondition from "../preconditions/berserk"
import { SkillType } from "../skillType"
import berserk from "./berserk"

describe("berserk skill actions", () => {
  it("should be able to fail berserking", async () => {
    // setup
    const testBuilder = new TestBuilder()

    // given
    const playerBuilder = await testBuilder.withPlayer()
    playerBuilder.withSkill(SkillType.Berserk)

    // when
    const request = testBuilder.createRequest(RequestType.Berserk)
    const check = await berserkPrecondition(request)
    const responses = await doNTimes(10, () => berserk(new CheckedRequest(request, check)))

    // then
    expect(responses.some(response => !response.isSuccessful())).toBeTruthy()
    expect(playerBuilder.player.sessionMob.getAffect(AffectType.Berserk)).toBeFalsy()
  })

  it("should be able to succeed berserking", async () => {
    // setup
    const testBuilder = new TestBuilder()

    // given
    const playerBuilder = await testBuilder.withPlayer()
    playerBuilder.withSkill(SkillType.Berserk, MAX_PRACTICE_LEVEL)

    // when
    const request = testBuilder.createRequest(RequestType.Berserk)
    const check = await berserkPrecondition(request)
    const responses = await doNTimes(10, () => berserk(new CheckedRequest(request, check)))

    // then
    expect(responses.some(response => response.isSuccessful())).toBeTruthy()
    expect(playerBuilder.player.sessionMob.getAffect(AffectType.Berserk)).toBeTruthy()
  })
})
