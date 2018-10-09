import doNTimes from "../../functional/times"
import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import { getSkillActionDefinition } from "../skillCollection"
import { SkillType } from "../skillType"

const iterations = 100
const definition = getSkillActionDefinition(SkillType.FastHealing)
const testBuilder = new TestBuilder()

async function action() {
  return definition.action(
    await testBuilder.createCheckedRequestFrom(RequestType.Event, definition.preconditions))
}

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
