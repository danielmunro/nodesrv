import doNTimes from "../../functional/times"
import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import { getSkillActionDefinition } from "../skillCollection"
import SkillDefinition from "../skillDefinition"
import { SkillType } from "../skillType"

let testBuilder: TestBuilder
let definition: SkillDefinition

beforeEach(() => {
  testBuilder = new TestBuilder()
  definition = getSkillActionDefinition(SkillType.Bash)
})

describe("bash", () => {
  it("should be able to trigger a failed bash", async () => {
    // given
    await testBuilder.withPlayerAndSkill(SkillType.Bash)
    testBuilder.fight()

    // when
    const responses = await doNTimes(10, async () =>
      definition.action(
        await testBuilder.createCheckedRequestFrom(RequestType.Bash, definition.preconditions)))

    // then
    expect(responses.some(r => !r.isSuccessful())).toBeTruthy()
  })

  it("should be able to trigger a successful bash", async () => {
    // given
    await testBuilder.withPlayerAndSkill(SkillType.Bash, MAX_PRACTICE_LEVEL)
    testBuilder.fight()

    // when
    const responses = await doNTimes(10, async () =>
      definition.action(
        await testBuilder.createCheckedRequestFrom(RequestType.Bash, definition.preconditions)))

    // then
    expect(responses.some(r => r.isSuccessful())).toBeTruthy()
  })
})
