import { SkillType } from "../../../../skill/skillType"
import doNTimes from "../../../../support/functional/times"
import TestBuilder from "../../../../test/testBuilder"

const SKILL_LEVEL = 50

describe("second attacks skill action", () => {
  it("should invoke a second attack", async () => {
    // setup
    const testBuilder = new TestBuilder()
    testBuilder.withMob()
      .withLevel(30)
      .withSkill(SkillType.SecondAttack, SKILL_LEVEL)
    const target = testBuilder.withMob().withLevel(30)

    // given
    const fight = await testBuilder.fight(target.mob)

    // when
    const rounds = await doNTimes(100, () => fight.round())

    // then
    expect(rounds.find(round => round.attacks.length > 1)).not.toBeUndefined()
    expect(rounds.find(round => round.attacks.length === 1)).not.toBeUndefined()
  })
})