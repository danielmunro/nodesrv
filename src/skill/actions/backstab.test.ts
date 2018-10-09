import { all } from "../../functional/collection"
import doNTimes from "../../functional/times"
import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import { Mob } from "../../mob/model/mob"
import { RequestType } from "../../request/requestType"
import { format } from "../../support/string"
import MobBuilder from "../../test/mobBuilder"
import TestBuilder from "../../test/testBuilder"
import { Messages as AllMessages } from "../preconditions/constants"
import { getSkillActionDefinition } from "../skillCollection"
import { SkillType } from "../skillType"
import { Messages } from "./constants"

const iterations = 1000
const definition = getSkillActionDefinition(SkillType.Backstab)
let testBuilder: TestBuilder
let mobBuilder: MobBuilder
let opponent: Mob

beforeEach(() => {
  testBuilder = new TestBuilder()
  mobBuilder = testBuilder.withMob()
  const fight = testBuilder.fight()
  opponent = fight.getOpponentFor(mobBuilder.mob)
})

describe("backstab skill action", () => {
  it("should require having the skill", async () => {
    // when
    const response = await definition.doAction(testBuilder.createRequest(RequestType.Backstab))

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.message).toBe(AllMessages.All.NoSkill)
  })

  it("should fail when not practiced", async () => {
    // given
    mobBuilder.withSkill(SkillType.Backstab)

    // when
    const responses = await doNTimes(iterations, () =>
      definition.doAction(testBuilder.createRequest(RequestType.Backstab)))

    // then
    expect(all(responses, r => r.isFailure())).toBeTruthy()
    expect(all(responses, r => r.message === format(Messages.Backstab.Failure, opponent)))
  })

  it("should succeed sometimes when partially practiced", async () => {
    // given
    mobBuilder.mob.level = 30
    mobBuilder.withSkill(SkillType.Backstab, MAX_PRACTICE_LEVEL / 2)

    // when
    const responses = await doNTimes(iterations, () =>
      definition.doAction(testBuilder.createRequest(RequestType.Backstab)))

    // then
    expect(responses.filter(r => r.isSuccessful()).length).toBeGreaterThan(iterations / 2)
  })

  it("should succeed sometimes when fully practiced", async () => {
    // given
    mobBuilder.mob.level = 50
    mobBuilder.withSkill(SkillType.Backstab, MAX_PRACTICE_LEVEL)

    // when
    const responses = await doNTimes(iterations, () =>
      definition.doAction(testBuilder.createRequest(RequestType.Backstab)))

    // then
    expect(responses.filter(r => r.isSuccessful()).length).toBeGreaterThan(iterations * 0.90)
  })
})
