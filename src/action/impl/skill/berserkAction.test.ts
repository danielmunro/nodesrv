import { AffectType } from "../../../affect/affectType"
import { MAX_PRACTICE_LEVEL } from "../../../mob/constants"
import { RequestType } from "../../../request/requestType"
import { Messages } from "../../../skill/constants"
import { SkillType } from "../../../skill/skillType"
import { all } from "../../../support/functional/collection"
import doNTimes from "../../../support/functional/times"
import TestBuilder from "../../../test/testBuilder"
import Action from "../../action"

const iterations = 10
let testBuilder: TestBuilder
let skillDefinition: Action

beforeEach(async () => {
  testBuilder = new TestBuilder()
  skillDefinition = await testBuilder.getActionDefinition(RequestType.Berserk)
})

async function action() {
  return skillDefinition.handle(testBuilder.createRequest(RequestType.Berserk))
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