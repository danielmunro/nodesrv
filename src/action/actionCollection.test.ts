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
    const playerBuilder = await testBuilder.withPlayer()
    playerBuilder.withSkill(SkillType.Bash)
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
    const playerBuilder = await testBuilder.withPlayer()
    playerBuilder.withSkill(SkillType.Bash)
    const actions = await testBuilder.getActionCollection()

    const action = await actions.getMatchingHandlerDefinitionForRequestType(RequestType.Ban, AuthorizationLevel.Mortal)

    expect(action).toBeNull()
  })

  it("admins should be able to access admin actions", async () => {
    // given
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer()
    playerBuilder.withSkill(SkillType.Bash)
    const actions = await testBuilder.getActionCollection()

    const action = await actions.getMatchingHandlerDefinitionForRequestType(RequestType.Ban, AuthorizationLevel.Admin)

    expect(action).toBeInstanceOf(Definition)
  })
})
