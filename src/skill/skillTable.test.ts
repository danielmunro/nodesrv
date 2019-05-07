import {createTestAppContainer} from "../inversify.config"
import TestRunner from "../support/test/testRunner"
import {Types} from "../support/types"
import {SkillType} from "./skillType"

describe("skill table", () => {
  it("should be able to invoke a weapon skill", async () => {
    // setup
    const testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)

    // given
    testRunner.createMob().withSkill(SkillType.Axe)

    // when
    const response = await testRunner.invokeSkill(SkillType.Axe)

    // then
    expect(response.isSuccessful()).toBeTruthy()
  })
})
