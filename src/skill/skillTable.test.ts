import {RequestType} from "../request/requestType"
import TestBuilder from "../test/testBuilder"
import {SkillType} from "./skillType"

describe("skill table", () => {
  it("should be able to invoke a weapon skill", async () => {
    // setup
    const testBuilder = new TestBuilder()

    // given
    const skill = await testBuilder.getSkillDefinition(SkillType.Axe)

    // when
    const response = await skill.doAction(testBuilder.createRequest(RequestType.Noop))

    // then
    expect(response.isSuccessful()).toBeTruthy()
  })
})
