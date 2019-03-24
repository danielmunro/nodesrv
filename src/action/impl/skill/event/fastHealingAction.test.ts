import { MAX_PRACTICE_LEVEL } from "../../../../mob/constants"
import { RequestType } from "../../../../request/requestType"
import { SkillType } from "../../../../skill/skillType"
import doNTimes from "../../../../support/functional/times"
import TestBuilder from "../../../../test/testBuilder"
import Skill from "../../skill"

const iterations = 100
let testBuilder: TestBuilder
let skill: Skill

async function doAction() {
  return skill.handle(testBuilder.createRequest(RequestType.Noop))
}

beforeEach(async () => {
  testBuilder = new TestBuilder()
  skill = await testBuilder.getSkill(SkillType.FastHealing)
})

describe("fast healing skill action", () => {
  it("should succeed and fail periodically", async () => {
    // setup
    const mobBuilder = testBuilder.withMob()

    // given
    mobBuilder.mob.level = 30
    mobBuilder.withSkill(SkillType.FastHealing, MAX_PRACTICE_LEVEL)

    // when
    const responses = await doNTimes(iterations, () => doAction())

    // then
    expect(responses.some(response => response.isSuccessful())).toBeTruthy()
    expect(responses.some(response => response.isFailure())).toBeTruthy()
  })
})
