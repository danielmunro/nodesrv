import { AffectType } from "../../affect/affectType"
import { all } from "../../functional/collection"
import doNTimes from "../../functional/times"
import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import { RequestType } from "../../request/requestType"
import MobBuilder from "../../test/mobBuilder"
import TestBuilder from "../../test/testBuilder"
import { getSkillActionDefinition } from "../skillCollection"
import { SkillType } from "../skillType"
import { Messages } from "../constants"
import { format } from "../../support/string"

const iterations = 10
const definition = getSkillActionDefinition(SkillType.DirtKick)
let testBuilder: TestBuilder
let mobBuilder: MobBuilder

beforeEach(() => {
  testBuilder = new TestBuilder()
  mobBuilder = testBuilder.withMob()
})

async function action() {
  return definition.action(
    await testBuilder.createCheckedRequestFrom(RequestType.DirtKick, definition.preconditions))
}

describe("dirt kick skill action", () => {
  it("should fail when not practiced", async () => {
    // given
    mobBuilder.withSkill(SkillType.DirtKick)
    const fight = testBuilder.fight()
    const opponent = fight.getOpponentFor(mobBuilder.mob)

    // when
    const responses = await doNTimes(iterations, () => action())

    // then
    expect(all(responses, r => !r.isSuccessful())).toBeTruthy()
    expect(all(responses, r => r.message = format(Messages.DirtKick.Fail, opponent))).toBeTruthy()
  })

  it("should succeed when practiced", async () => {
    // given
    mobBuilder.withSkill(SkillType.DirtKick, MAX_PRACTICE_LEVEL)
    const fight = testBuilder.fight()
    const opponent = fight.getOpponentFor(mobBuilder.mob)

    // when
    const responses = await doNTimes(iterations, () => action())

    // then
    expect(responses.some(r => r.isSuccessful())).toBeTruthy()
    expect(opponent.getAffect(AffectType.Blind)).toBeDefined()
  })

  it("should not be able to stack blind affects", async () => {
    // given
    mobBuilder.withSkill(SkillType.DirtKick, MAX_PRACTICE_LEVEL)
    const fight = testBuilder.fight()
    const opponent = fight.getOpponentFor(mobBuilder.mob)

    // when
    const responses = await doNTimes(iterations * 10, () => action())

    // then
    expect(responses.some(r => r.isSuccessful())).toBeTruthy()
    expect(opponent.affects).toHaveLength(1)
  })
})
