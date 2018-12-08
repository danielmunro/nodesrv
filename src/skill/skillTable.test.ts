import TestBuilder from "../test/testBuilder"
import {SkillType} from "./skillType"
import {RequestType} from "../request/requestType"
import {ActionOutcome} from "../action/actionOutcome"

describe("skill table", () => {
  it("should be able to invoke a weapon skill", async () => {
    // setup
    const testBuilder = new TestBuilder()

    // given
    const skill = await testBuilder.getSkillDefinition(SkillType.Axe)

    // when
    const response = await skill.doAction(testBuilder.createRequest(RequestType.Noop))

    // then
    expect(response.responseAction.actionOutcome).toBe(ActionOutcome.None)
  })
})
