import doNTimes from "../../functional/times"
import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import { getSkillActionDefinition } from "../skillCollection"
import { SkillType } from "../skillType"

const iterations = 10
let testBuilder: TestBuilder
const definition = getSkillActionDefinition(SkillType.Bash)

beforeEach(() => {
  testBuilder = new TestBuilder()
})

async function action() {
  return definition.action(await testBuilder.createCheckedRequestFrom(
    RequestType.Bash,
    definition.preconditions))
}

describe("bash", () => {
  it("should be able to trigger a failed bash", async () => {
    // given
    await testBuilder.withPlayerAndSkill(SkillType.Bash)
    testBuilder.fight()

    // when
    const responses = await doNTimes(iterations, async () => action())

    // then
    expect(responses.some(r => !r.isSuccessful())).toBeTruthy()
  })

  it("should be able to trigger a successful bash", async () => {
    // given
    await testBuilder.withPlayerAndSkill(SkillType.Bash, MAX_PRACTICE_LEVEL)
    testBuilder.fight()

    // when
    const responses = await doNTimes(iterations, async () => action())

    // then
    expect(responses.some(r => r.isSuccessful())).toBeTruthy()
  })
})
