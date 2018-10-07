import { AffectType } from "../../affect/affectType"
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
  definition = getSkillActionDefinition(SkillType.Berserk)
})

describe("berserk skill actions", () => {
  it("should be able to fail berserking", async () => {
    // given
    const playerBuilder = await testBuilder.withPlayer()
    playerBuilder.withSkill(SkillType.Berserk)

    // when
    const responses = await doNTimes(10, async () =>
      definition.action(
        await testBuilder.createCheckedRequestFrom(RequestType.Berserk, definition.preconditions)))

    // then
    expect(responses.some(response => !response.isSuccessful())).toBeTruthy()
    expect(testBuilder.getPlayerMob().getAffect(AffectType.Berserk)).toBeFalsy()
  })

  it("should be able to succeed berserking", async () => {
    // given
    const playerBuilder = await testBuilder.withPlayer()
    playerBuilder.withSkill(SkillType.Berserk, MAX_PRACTICE_LEVEL)

    // when
    const responses = await doNTimes(10, async () =>
      definition.action(
        await testBuilder.createCheckedRequestFrom(RequestType.Berserk, definition.preconditions)))

    // then
    expect(responses.some(response => response.isSuccessful())).toBeTruthy()
    expect(testBuilder.getPlayerMob().getAffect(AffectType.Berserk)).toBeTruthy()
  })
})
