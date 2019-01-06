import CheckedRequest from "../../check/checkedRequest"
import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import { RequestType } from "../../request/requestType"
import doNTimes from "../../support/functional/times"
import TestBuilder from "../../test/testBuilder"
import tripPrecondition from "../precondition/trip"
import { SkillType } from "../skillType"
import trip from "./trip"

describe("trip skill action", () => {
  it("should be able to fail tripping", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer()

    // given
    playerBuilder.withSkill(SkillType.Trip)

    // and
    await testBuilder.fight()

    const request = testBuilder.createRequest(RequestType.Trip)
    const check = await tripPrecondition(request, await testBuilder.getService())

    // when
    const results = await doNTimes(100, () => trip(new CheckedRequest(request, check)))

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
    await testBuilder.fight()

    const request = testBuilder.createRequest(RequestType.Trip)
    const check = await tripPrecondition(request, await testBuilder.getService())

    // when
    const results = await doNTimes(10, () => trip(new CheckedRequest(request, check)))

    // then
    expect(results.some(result => result.isSuccessful())).toBeTruthy()
  })
})
