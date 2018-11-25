import { AffectType } from "../../affect/affectType"
import { all } from "../../support/functional/collection"
import doNTimes from "../../support/functional/times"
import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import { Messages } from "../constants"
import SkillDefinition from "../skillDefinition"
import { SkillType } from "../skillType"

const iterations = 10
let testBuilder: TestBuilder
let definition: SkillDefinition

beforeEach(async () => {
  testBuilder = new TestBuilder()
  definition = await testBuilder.getSkillDefinition(SkillType.Bash)
})

async function action() {
  return definition.doAction(testBuilder.createRequest(RequestType.Bash))
}

describe("bash", () => {
  it("should be able to trigger a failed bash", async () => {
    // given
    await testBuilder.withPlayerAndSkill(SkillType.Bash)
    await testBuilder.fight()

    // when
    const responses = await doNTimes(iterations, action)

    // then
    expect(responses.some(r => !r.isSuccessful())).toBeTruthy()
    expect(all(responses, r => r.result === Messages.Bash.Fail))
  })

  it("should be able to trigger a successful bash", async () => {
    // given
    const player = await testBuilder.withPlayerAndSkill(SkillType.Bash, MAX_PRACTICE_LEVEL)
    player.sessionMob.level = 20
    const fight = await testBuilder.fight()

    // when
    const responses = await doNTimes(iterations, action)

    // then
    expect(responses.some(r => r.isSuccessful())).toBeTruthy()
    expect(fight.getOpponentFor(player.sessionMob).getAffect(AffectType.Stunned)).toBeDefined()
  })
})
