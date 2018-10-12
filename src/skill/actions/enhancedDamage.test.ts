import doNTimes from "../../functional/times"
import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import { getSkillActionDefinition } from "../skillTable"
import SkillDefinition from "../skillDefinition"
import { SkillType } from "../skillType"

const iterations = 1000
let testBuilder: TestBuilder
let definition: SkillDefinition

beforeEach(() => {
  testBuilder = new TestBuilder()
  definition = getSkillActionDefinition(SkillType.EnhancedDamage)
})

async function action() {
  return definition.action(
    await testBuilder.createCheckedRequestFrom(RequestType.Event, definition.preconditions))
}

describe("enhanced damage", () => {
  it("should succeed more than half the time when practiced", async () => {
    // given
    await testBuilder.withPlayerAndSkill(SkillType.EnhancedDamage, MAX_PRACTICE_LEVEL)

    // when
    const responses = await doNTimes(iterations, async () => action())

    // then
    expect(responses.filter(r => r.isSuccessful()).length).toBeGreaterThan(iterations / 2)
  })

  it("should succeed somewhat when practiced some", async () => {
    // given
    await testBuilder.withPlayerAndSkill(SkillType.EnhancedDamage, MAX_PRACTICE_LEVEL / 2)

    // when
    const responses = await doNTimes(iterations, async () => action())

    // then
    expect(responses.filter(r => r.isSuccessful()).length).toBeLessThan(iterations / 2)
  })

  it("should succeed infrequently when not practiced", async () => {
    // given
    await testBuilder.withPlayerAndSkill(SkillType.EnhancedDamage)

    // when
    const responses = await doNTimes(iterations, async () => action())

    // then
    expect(responses.filter(r => r.isSuccessful()).length).toBeLessThan(iterations / 10)
  })
})
