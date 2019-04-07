import Skill from "../action/impl/skill"
import {RequestType} from "../request/requestType"
import TestBuilder from "../support/test/testBuilder"
import {SkillType} from "./skillType"

describe("skill table", () => {
  it("should be able to invoke a weapon skill", async () => {
    // setup
    const testBuilder = new TestBuilder()
    testBuilder.withMob().withSkill(SkillType.Axe)

    // given
    const skill = await testBuilder.getSkill(SkillType.Axe) as Skill

    // when
    const response = await skill.handle(testBuilder.createRequest(RequestType.Noop))

    // then
    expect(response.isSuccessful()).toBeTruthy()
  })
})
