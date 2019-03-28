import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {Fight} from "../../../../mob/fight/fight"
import { SkillType } from "../../../../skill/skillType"
import doNTimes from "../../../../support/functional/times"
import MobBuilder from "../../../../test/mobBuilder"
import TestBuilder from "../../../../test/testBuilder"

const ITERATIONS = 1000
const maxHp = 20
let testBuilder: TestBuilder
let aggressor: MobBuilder
let target: MobBuilder
let fight: Fight

beforeEach(async () => {
  testBuilder = new TestBuilder()
  aggressor = testBuilder.withMob()
    .setLevel(30)
  target = testBuilder.withMob().setLevel(30)
  fight = await testBuilder.fight(target.mob)
})

describe("second attacks skill action", () => {
  it("should invoke a second attack", async () => {
    // given
    aggressor.withSkill(SkillType.SecondAttack, MAX_PRACTICE_LEVEL)

    // when
    const rounds = await doNTimes(ITERATIONS, () => {
      aggressor.setHp(maxHp)
      target.setHp(maxHp)
      return fight.round()
    })

    // then
    expect(rounds.filter(round => round.attacks.length > 1).length).toBeGreaterThan(0)
  })

  it("only has one attack if no skill", async () => {
    // when
    const rounds = await doNTimes(ITERATIONS, () => {
      aggressor.setHp(maxHp)
      target.setHp(maxHp)
      return fight.round()
    })

    // then
    expect(rounds.filter(round => round.attacks.length > 1).length).toBe(0)
  })
})
