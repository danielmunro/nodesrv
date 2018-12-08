import TestBuilder from "../test/testBuilder"
import {SkillType} from "./skillType"
import {RequestType} from "../request/requestType"

describe("skill table", () => {
  it("should do something weapony", async () => {
    const testBuilder = new TestBuilder()
    const skill = await testBuilder.getSkillDefinition(SkillType.Axe)
    const response = await skill.doAction(testBuilder.createRequest(RequestType.Noop))
    console.log(response)
  })
})
