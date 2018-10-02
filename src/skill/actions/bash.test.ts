import CheckedRequest from "../../check/checkedRequest"
import doNTimes from "../../functional/times"
import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import bashPrecondition from "../preconditions/bash"
import { SkillType } from "../skillType"
import bash from "./bash"

describe("bash", () => {
  it("should be able to trigger a failed bash", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const player = await testBuilder.withPlayer()
    player.withSkill(SkillType.Bash)
    testBuilder.fight()
    const request = testBuilder.createRequest(RequestType.Bash)
    const check = await bashPrecondition(request)

    // when
    const responses = await doNTimes(10, () => bash(new CheckedRequest(request, check)))

    // then
    expect(responses.some(r => !r.isSuccessful())).toBeTruthy()
  })

  it("should be able to trigger a successful bash", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const player = await testBuilder.withPlayer()
    player.withSkill(SkillType.Bash, MAX_PRACTICE_LEVEL)
    testBuilder.fight()
    const request = testBuilder.createRequest(RequestType.Bash)
    const check = await bashPrecondition(request)

    // when
    const responses = await doNTimes(10, () => bash(new CheckedRequest(request, check)))

    // then
    expect(responses.some(r => r.isSuccessful())).toBeTruthy()
  })
})
