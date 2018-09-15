import { AuthorizationLevel } from "../player/authorizationLevel"
import { RequestType } from "../request/requestType"
import { ResponseStatus } from "../request/responseStatus"
import { SkillType } from "../skill/skillType"
import TestBuilder from "../test/testBuilder"
import { Definition } from "./definition/definition"

describe("actions actions collection", () => {
  it("should be able to bash", async () => {
    // given
    const testBuilder = new TestBuilder()
    testBuilder.withPlayer().withSkill(SkillType.Bash)
    const target = testBuilder.withMob("bob").mob
    const actions = await testBuilder.getActionCollection()

    // and
    const action = actions.getMatchingHandlerDefinitionForRequestType(RequestType.Bash)

    // when
    const response = await action.handle(testBuilder.createRequest(RequestType.Bash, "bash bob", target))

    // then
    expect(response.status).not.toBe(ResponseStatus.PreconditionsFailed)
  })

  it("should not be able to access admin actions", async () => {
    // given
    const testBuilder = new TestBuilder()
    testBuilder.withPlayer().withSkill(SkillType.Bash)
    const actions = await testBuilder.getActionCollection()

    const action = await actions.getMatchingHandlerDefinitionForRequestType(RequestType.Ban, AuthorizationLevel.Mortal)

    expect(action).toBeNull()
  })

  it("admins should be able to access admin actions", async () => {
    // given
    const testBuilder = new TestBuilder()
    testBuilder.withPlayer().withSkill(SkillType.Bash)
    const actions = await testBuilder.getActionCollection()

    const action = await actions.getMatchingHandlerDefinitionForRequestType(RequestType.Ban, AuthorizationLevel.Admin)

    expect(action).toBeInstanceOf(Definition)
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
