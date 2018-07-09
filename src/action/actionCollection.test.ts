import { RequestType } from "../request/requestType"
import { ResponseStatus } from "../request/responseStatus"
import { SkillType } from "../skill/skillType"
import TestBuilder from "../test/testBuilder"
import { actions } from "./actionCollection"

describe("actions actions collection", () => {
  it("should be able to bash", async () => {
    // given
    const testBuilder = new TestBuilder()
    testBuilder.withPlayer().withSkill(SkillType.Bash)
    testBuilder.withMob("bob")

    // and
    const action = actions.getMatchingHandlerDefinitionForRequestType(RequestType.Bash)

    // when
    const response = await action.handle(testBuilder.createRequest(RequestType.Bash, "bash bob"))

    // then
    expect(response.status).not.toBe(ResponseStatus.PreconditionsFailed)
  })

  it("should be able to trip", async () => {
    // given
    const testBuilder = new TestBuilder()
    testBuilder.withPlayer().withSkill(SkillType.Trip)
    testBuilder.withMob("bob")

    // and
    const action = actions.getMatchingHandlerDefinitionForRequestType(RequestType.Trip)

    // when
    const response = await action.handle(testBuilder.createRequest(RequestType.Trip, "trip bob"))

    // then
    expect(response.status).not.toBe(ResponseStatus.PreconditionsFailed)
  })

  it("should be able to berserk", async () => {
    // given
    const testBuilder = new TestBuilder()
    testBuilder.withPlayer().withSkill(SkillType.Berserk)

    // and
    const action = actions.getMatchingHandlerDefinitionForRequestType(RequestType.Berserk)

    // when
    const response = await action.handle(testBuilder.createRequest(RequestType.Berserk, "berserk"))

    // then
    expect(response.status).not.toBe(ResponseStatus.PreconditionsFailed)
  })

  it("should be able to sneak", async () => {
    // given
    const testBuilder = new TestBuilder()
    testBuilder.withPlayer().withSkill(SkillType.Sneak)

    // and
    const action = actions.getMatchingHandlerDefinitionForRequestType(RequestType.Sneak)

    // when
    const response = await action.handle(testBuilder.createRequest(RequestType.Sneak, "sneak"))

    // then
    expect(response.status).not.toBe(ResponseStatus.PreconditionsFailed)
  })
})
