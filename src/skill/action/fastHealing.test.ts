import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import { RequestType } from "../../request/requestType"
import doNTimes from "../../support/functional/times"
import TestBuilder from "../../test/testBuilder"
import SkillDefinition from "../skillDefinition"
import { SkillType } from "../skillType"

const iterations = 100
let testBuilder: TestBuilder
let skillDefinition: SkillDefinition

async function action() {
  return skillDefinition.doAction(testBuilder.createRequest(RequestType.Noop))
}

beforeEach(async () => {
  testBuilder = new TestBuilder()
  skillDefinition = await testBuilder.getSkillDefinition(SkillType.FastHealing)
})

describe("fast healing skill action", () => {
  it("should succeed and fail periodically", async () => {
    // setup
    const mobBuilder = testBuilder.withMob()

    // given
    mobBuilder.mob.level = 30
    mobBuilder.withSkill(SkillType.FastHealing, MAX_PRACTICE_LEVEL)

    // when
    const responses = await doNTimes(iterations, () => action())

    // then
    expect(responses.some(response => response.isSuccessful())).toBeTruthy()
    expect(responses.some(response => response.isFailure())).toBeTruthy()
  })
})
