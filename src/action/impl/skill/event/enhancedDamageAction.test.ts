import Skill from "../../skill"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {RequestType} from "../../../../request/requestType"
import {SkillType} from "../../../../skill/skillType"
import doNTimes from "../../../../support/functional/times"
import PlayerBuilder from "../../../../test/playerBuilder"
import TestBuilder from "../../../../test/testBuilder"

const iterations = 100
let testBuilder: TestBuilder
let player: PlayerBuilder
let definition: Skill

beforeEach(async () => {
  testBuilder = new TestBuilder()
  definition = await testBuilder.getSkill(SkillType.EnhancedDamage) as Skill
  player = await testBuilder.withPlayer()
  player.setLevel(40)
})

describe("enhanced damage", () => {
  it("should succeed sometimes when practiced", async () => {
    // given
    player.addSkill(SkillType.EnhancedDamage, MAX_PRACTICE_LEVEL)
    await testBuilder.fight()

    // when
    const responses = await doNTimes(iterations, async () =>
      definition.handle(testBuilder.createRequest(RequestType.Noop)))

    // then
    expect(responses.filter(r => r.isSuccessful()).length).toBeGreaterThanOrEqual(iterations * 0.1)
  })

  it("should succeed somewhat when practiced some", async () => {
    // given
    player.addSkill(SkillType.EnhancedDamage, MAX_PRACTICE_LEVEL / 2)
    await testBuilder.fight()

    // when
    const responses = await doNTimes(iterations, async () =>
      definition.handle(testBuilder.createRequest(RequestType.Noop)))

    // then
    expect(responses.filter(r => r.isSuccessful()).length).toBeGreaterThanOrEqual(iterations * 0.05)
    expect(responses.filter(r => r.isSuccessful()).length).toBeLessThanOrEqual(iterations * 0.6)
  })

  it("should succeed infrequently when not practiced", async () => {
    // given
    player.addSkill(SkillType.EnhancedDamage)
    await testBuilder.fight()

    // when
    const responses = await doNTimes(iterations, async () =>
      definition.handle(testBuilder.createRequest(RequestType.Noop)))

    // then
    expect(responses.filter(r => r.isSuccessful()).length).toBeLessThanOrEqual(iterations * 0.2)
  })
})
