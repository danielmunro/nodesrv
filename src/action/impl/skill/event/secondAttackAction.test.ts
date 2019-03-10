import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import { SkillType } from "../../../../skill/skillType"
import doNTimes from "../../../../support/functional/times"
import TestBuilder from "../../../../test/testBuilder"

const ITERATIONS = 1000
const maxHp = 20

describe("second attacks skill action", () => {
  it("should invoke a second attack", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const aggressor = testBuilder.withMob()
      .setLevel(30)
      .withSkill(SkillType.SecondAttack, MAX_PRACTICE_LEVEL)
    const target = testBuilder.withMob().setLevel(30)

    // given
    const fight = await testBuilder.fight(target.mob)

    // when
    const rounds = await doNTimes(ITERATIONS, () => {
      aggressor.setHp(maxHp)
      target.setHp(maxHp)
      return fight.round()
    })

    // then
    expect(rounds.filter(round => round.attacks.length > 1).length).toBeGreaterThan(0)
  })
})
