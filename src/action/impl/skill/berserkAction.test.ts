import { AffectType } from "../../../affect/affectType"
import { MAX_PRACTICE_LEVEL } from "../../../mob/constants"
import { RequestType } from "../../../request/requestType"
import Response from "../../../request/response"
import { SkillType } from "../../../skill/skillType"
import doNTimes from "../../../support/functional/times"
import TestBuilder from "../../../test/testBuilder"
import Action from "../../action"

const iterations = 100
let testBuilder: TestBuilder
let skillDefinition: Action

beforeEach(async () => {
  testBuilder = new TestBuilder()
  skillDefinition = await testBuilder.getAction(RequestType.Berserk)
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
    expect(responses.filter(response => !response.isSuccessful()).length).toBeGreaterThanOrEqual(iterations * 0.9)
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

  it("should generate accurate messages", async () => {
    // given
    const mobBuilder = testBuilder.withMob()
    mobBuilder.withLevel(40)
    mobBuilder.withSkill(SkillType.Berserk, MAX_PRACTICE_LEVEL)

    // when
    const responses: Response[] = await doNTimes(iterations, () => action())

    // then
    const successMessage = responses.find(response => response.isSuccessful()).message
    expect(successMessage.getMessageToRequestCreator())
      .toBe("your pulse speeds up as you are consumed by rage!")
    expect(successMessage.getMessageToObservers())
      .toBe(`${mobBuilder.mob.name}'s pulse speeds up as they are consumed by rage!`)

    // and
    const failMessage = responses.find(response => !response.isSuccessful()).message
    expect(failMessage.getMessageToRequestCreator())
      .toBe("You fail to summon your inner rage.")
    expect(failMessage.getMessageToTarget())
      .toBe("")
    expect(failMessage.getMessageToObservers())
      .toBe("")
  })
})
