import CheckedRequest from "../../check/checkedRequest"
import doNTimes from "../../functional/times"
import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import { addFight, Fight } from "../../mob/fight/fight"
import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import tripPrecondition from "../preconditions/trip"
import { SkillType } from "../skillType"
import trip from "./trip"

describe("trip skill actions", () => {
  it("should be able to fail tripping", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer()

    // given
    playerBuilder.withSkill(SkillType.Trip)

    // and
    addFight(new Fight(
      playerBuilder.player.sessionMob,
      testBuilder.withMob().mob,
      testBuilder.room))

    const request = new Request(playerBuilder.player.sessionMob, RequestType.Trip)
    const check = await tripPrecondition(request)

    // when
    const results = await doNTimes(10, () => trip(new CheckedRequest(request, check)))

    // then
    expect(results.some(result => !result.isSuccessful())).toBeTruthy()
  })

  it("should be able to succeed tripping", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer()

    // given
    playerBuilder.withSkill(SkillType.Trip, MAX_PRACTICE_LEVEL)

    // and
    addFight(new Fight(
      playerBuilder.player.sessionMob,
      testBuilder.withMob().mob,
      testBuilder.room))

    const request = testBuilder.createRequest(RequestType.Trip)
    const check = await tripPrecondition(request)

    // when
    const results = await doNTimes(10, () => trip(new CheckedRequest(request, check)))

    // then
    expect(results.some(result => result.isSuccessful())).toBeTruthy()
  })
})
