import {MAX_PRACTICE_LEVEL} from "../../../mob/constants"
import {RequestType} from "../../../request/requestType"
import {newSkill} from "../../../skill/factory"
import {SkillType} from "../../../skill/skillType"
import doNTimes from "../../../support/functional/times"
import TestBuilder from "../../../test/testBuilder"
import Action from "../../action"

let testBuilder: TestBuilder
let action: Action

beforeEach(async () => {
  testBuilder = new TestBuilder()
  action = await testBuilder.getAction(RequestType.Sneak)
})

describe("sneak skill action", () => {
  it("should be able to fail sneaking", async () => {
    // given
    await testBuilder.withPlayer(p => p.sessionMob.skills.push(newSkill(SkillType.Sneak)))

    // when
    const responses = await doNTimes(10,
      async () => action.handle(testBuilder.createRequest(RequestType.Sneak)))

    // then
    expect(responses.some(response => !response.isSuccessful())).toBeTruthy()
  })

  it("should be able to succeed sneaking", async () => {
    // setup
    await testBuilder.withPlayer(p => {
      p.sessionMob.level = 40
      p.sessionMob.skills.push(newSkill(SkillType.Sneak, MAX_PRACTICE_LEVEL))
    })

    // when
    const responses = await doNTimes(10,
      async () => action.handle(testBuilder.createRequest(RequestType.Sneak)))

    // then
    expect(responses.some(response => response.isSuccessful())).toBeTruthy()
  })
})
