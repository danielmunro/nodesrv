import {createTestAppContainer} from "../../../../app/testFactory"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {Fight} from "../../../../mob/fight/fight"
import { SkillType } from "../../../../skill/skillType"
import doNTimes from "../../../../support/functional/times"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

const ITERATIONS = 1000
const maxHp = 20
let testRunner: TestRunner
let aggressor: MobBuilder
let target: MobBuilder
let fight: Fight

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  aggressor = testRunner.createMob()
    .setLevel(30)
  target = testRunner.createMob().setLevel(30)
  fight = testRunner.fight(target.mob)
})

describe("third attack skill action", () => {
  it("invokes an extra attack", async () => {
    // given
    aggressor.withSkill(SkillType.ThirdAttack, MAX_PRACTICE_LEVEL)

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
