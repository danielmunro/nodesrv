import { AuthorizationLevel } from "../player/authorizationLevel"
import { RequestType } from "../request/requestType"
import { ResponseStatus } from "../request/responseStatus"
import { SkillType } from "../skill/skillType"
import TestBuilder from "../test/testBuilder"
import { Definition } from "./definition/definition"

describe("action action collection", () => {
  it("should be able to look", async () => {
    // given
    const testBuilder = new TestBuilder()
    await testBuilder.withPlayer()
    const target = testBuilder.withMob("bob").mob
    const actions = await testBuilder.getActionCollection()

    // and
    const action = actions.getMatchingHandlerDefinitionForRequestType(RequestType.Look)

    // when
    const response = await action.handle(testBuilder.createRequest(RequestType.Look, "look bob", target))

    // then
    expect(response.status).not.toBe(ResponseStatus.PreconditionsFailed)
  })

  it("should not be able to access admin action", async () => {
    // given
    const testBuilder = new TestBuilder()
    await testBuilder.withPlayer()
    const actions = await testBuilder.getActionCollection()

    const action = actions.getMatchingHandlerDefinitionForRequestType(RequestType.Ban, AuthorizationLevel.Mortal)

    expect(action.requestType).toBe(RequestType.Any)
  })

  it("admins should be able to access admin action", async () => {
    // given
    const testBuilder = new TestBuilder()
    await testBuilder.withPlayer()
    const actions = await testBuilder.getActionCollection()

    const action = actions.getMatchingHandlerDefinitionForRequestType(RequestType.Ban, AuthorizationLevel.Admin)

    expect(action).toBeInstanceOf(Definition)
  })
})
