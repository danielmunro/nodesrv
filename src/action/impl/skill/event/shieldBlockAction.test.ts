import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {AttackResult} from "../../../../mob/fight/attack"
import {Fight} from "../../../../mob/fight/fight"
import {Round} from "../../../../mob/fight/round"
import {SkillType} from "../../../../skill/skillType"
import doNTimes from "../../../../support/functional/times"
import MobBuilder from "../../../../test/mobBuilder"
import TestBuilder from "../../../../test/testBuilder"

let testBuilder: TestBuilder
let attacker: MobBuilder
let defender: MobBuilder
let fight: Fight
const iterations = 1000

beforeEach(async () => {
  testBuilder = new TestBuilder()
  attacker = testBuilder.withMob()
    .withSkill(SkillType.ShieldBlock, MAX_PRACTICE_LEVEL)
    .setLevel(20)
  testBuilder.withItem()
    .asShield()
    .equipToMobBuilder(attacker)
    .build()
  defender = testBuilder.withMob()
  fight = await testBuilder.fight(defender.mob)
})

describe("shield block event consumer", () => {
  it("should block attacks sometimes if a shield is equipped", async () => {
    const rounds = await doNTimes(iterations, async () => {
      attacker.setHp(20)
      defender.setHp(20)
      return await fight.round()
    })

    const blocked = rounds.filter((round: Round) => {
      const counter = round.getLastCounter()
      return counter.result === AttackResult.ShieldBlock
    })

    expect(blocked.length).toBeGreaterThan(1)
  })
})
