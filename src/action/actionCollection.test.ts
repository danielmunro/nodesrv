import { RequestType } from "../request/requestType"
import { ResponseStatus } from "../request/responseStatus"
import { SkillType } from "../skill/skillType"
import TestBuilder from "../test/testBuilder"

describe("actions actions collection", () => {
  it("should be able to bash", async () => {
    // given
    const testBuilder = new TestBuilder()
    testBuilder.withPlayer().withSkill(SkillType.Bash)
    const mob = testBuilder.withMob("bob").mob
    const actions = await testBuilder.getActionCollection()

    // and
    const action = actions.getMatchingHandlerDefinitionForRequestType(RequestType.Bash)

    // when
    const response = await action.handle(testBuilder.createRequest(RequestType.Bash, "bash bob", mob))

    // then
    expect(response.status).not.toBe(ResponseStatus.PreconditionsFailed)
  })

  it("should be able to trip", async () => {
    // given
    const testBuilder = new TestBuilder()
    testBuilder.withPlayer().withSkill(SkillType.Trip)
    const target = testBuilder.withMob("bob").mob
    const actions = await testBuilder.getActionCollection()

    // and
    const action = actions.getMatchingHandlerDefinitionForRequestType(RequestType.Trip)

    // when
    const response = await action.handle(testBuilder.createRequest(RequestType.Trip, "trip bob", target))

    // then
    expect(response.status).not.toBe(ResponseStatus.PreconditionsFailed)
  })

  it("should be able to berserk", async () => {
    // given
    const testBuilder = new TestBuilder()
    testBuilder.withPlayer().withSkill(SkillType.Berserk)
    const actions = await testBuilder.getActionCollection()

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
    const actions = await testBuilder.getActionCollection()

    // and
    const action = actions.getMatchingHandlerDefinitionForRequestType(RequestType.Sneak)

    // when
    const response = await action.handle(testBuilder.createRequest(RequestType.Sneak, "sneak"))

    // then
    expect(response.status).not.toBe(ResponseStatus.PreconditionsFailed)
  })
})
