import CheckedRequest from "../../check/checkedRequest"
import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import { RequestType } from "../../request/requestType"
import doNTimes from "../../support/functional/times"
import TestBuilder from "../../test/testBuilder"
import { newSkill } from "../factory"
import sneakPrecondition from "../precondition/sneak"
import { SkillType } from "../skillType"
import sneak from "./sneak"

describe("sneak skill action", () => {
  it("should be able to fail sneaking", async () => {
    // setup
    const testBuilder = new TestBuilder()
    await testBuilder.withPlayer(p => p.sessionMob.skills.push(newSkill(SkillType.Sneak)))
    const request = testBuilder.createRequest(RequestType.Sneak)
    const check = await sneakPrecondition(request, await testBuilder.getService())

    // when
    const responses = await doNTimes(10, async () => sneak(new CheckedRequest(request, check)))

    // then
    expect(responses.some(response => !response.isSuccessful())).toBeTruthy()
  })

  it("should be able to succeed sneaking", async () => {
    // setup
    const testBuilder = new TestBuilder()
    await testBuilder.withPlayer(p => p.sessionMob.skills.push(newSkill(SkillType.Sneak, MAX_PRACTICE_LEVEL)))
    const request = testBuilder.createRequest(RequestType.Sneak)
    const check = await sneakPrecondition(testBuilder.createRequest(RequestType.Sneak), await testBuilder.getService())

    // when
    const responses = await doNTimes(10, async () => sneak(new CheckedRequest(request, check)))

    // then
    expect(responses.some(response => response.isSuccessful())).toBeTruthy()
  })
})
