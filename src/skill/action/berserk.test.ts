import { AffectType } from "../../affect/affectType"
import { all } from "../../functional/collection"
import doNTimes from "../../functional/times"
import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import { Messages } from "../constants"
import SkillDefinition from "../skillDefinition"
import { SkillType } from "../skillType"

const iterations = 10
let testBuilder: TestBuilder
let skillDefinition: SkillDefinition

beforeEach(async () => {
  testBuilder = new TestBuilder()
  skillDefinition = await testBuilder.getSkillDefinition(SkillType.Berserk)
})

async function action() {
  return skillDefinition.doAction(testBuilder.createRequest(RequestType.Berserk))
}

describe("berserk skill action", () => {
  it("should be able to fail berserking", async () => {
    // given
    const mobBuilder = testBuilder.withMob()
    mobBuilder.withSkill(SkillType.Berserk)

    // when
    const responses = await doNTimes(iterations, () => action())

    // then
    expect(all(responses, response => !response.isSuccessful())).toBeTruthy()
    expect(all(responses, response => response.result === Messages.Berserk.Fail))
    expect(mobBuilder.mob.getAffect(AffectType.Berserk)).toBeFalsy()
  })

  it("should be able to succeed berserking", async () => {
    // given
    const mobBuilder = testBuilder.withMob()
    mobBuilder.withLevel(20)
    mobBuilder.withSkill(SkillType.Berserk, MAX_PRACTICE_LEVEL)

    // when
    const responses = await doNTimes(iterations, () => action())

    // then
    expect(responses.some(response => response.isSuccessful())).toBeTruthy()
    expect(mobBuilder.mob.getAffect(AffectType.Berserk)).toBeTruthy()
  })
})
