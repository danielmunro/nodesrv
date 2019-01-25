import { AffectType } from "../../../affect/affectType"
import { MAX_PRACTICE_LEVEL } from "../../../mob/constants"
import { RequestType } from "../../../request/requestType"
import { Messages } from "../../../skill/constants"
import { SkillType } from "../../../skill/skillType"
import { all } from "../../../support/functional/collection"
import doNTimes from "../../../support/functional/times"
import { format } from "../../../support/string"
import MobBuilder from "../../../test/mobBuilder"
import TestBuilder from "../../../test/testBuilder"
import Action from "../../action"

const iterations = 10
let testBuilder: TestBuilder
let mobBuilder: MobBuilder
let action: Action

beforeEach(async () => {
  testBuilder = new TestBuilder()
  mobBuilder = testBuilder.withMob().withLevel(20)
  action = await testBuilder.getActionDefinition(RequestType.DirtKick)
})

describe("dirt kick skill action", () => {
  it("should fail when not practiced", async () => {
    // given
    mobBuilder.withSkill(SkillType.DirtKick)
    const fight = await testBuilder.fight()
    const opponent = fight.getOpponentFor(mobBuilder.mob)

    // when
    const responses = await doNTimes(iterations, () =>
      action.handle(testBuilder.createRequest(RequestType.DirtKick)))

    // then
    expect(all(responses, r => !r.isSuccessful())).toBeTruthy()
    expect(all(responses, r => r.message = format(Messages.DirtKick.Fail, opponent))).toBeTruthy()
  })

  it("should succeed when practiced", async () => {
    // given
    mobBuilder.withSkill(SkillType.DirtKick, MAX_PRACTICE_LEVEL)
    const fight = await testBuilder.fight()
    const opponent = fight.getOpponentFor(mobBuilder.mob)

    // when
    const responses = await doNTimes(iterations, () =>
      action.handle(testBuilder.createRequest(RequestType.DirtKick)))

    // then
    expect(responses.some(r => r.isSuccessful())).toBeTruthy()
    expect(opponent.getAffect(AffectType.Blind)).toBeDefined()
  })

  it("should not be able to stack blind affects", async () => {
    // given
    mobBuilder.withSkill(SkillType.DirtKick, MAX_PRACTICE_LEVEL)
    const fight = await testBuilder.fight()
    const opponent = fight.getOpponentFor(mobBuilder.mob)

    // when
    const responses = await doNTimes(iterations * 10, () =>
      action.handle(testBuilder.createRequest(RequestType.DirtKick)))

    // then
    expect(responses.some(r => r.isSuccessful())).toBeTruthy()
    expect(opponent.affects).toHaveLength(1)
  })
})
