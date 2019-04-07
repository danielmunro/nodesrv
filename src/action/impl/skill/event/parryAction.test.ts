import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {AttackResult} from "../../../../mob/fight/attack"
import {Fight} from "../../../../mob/fight/fight"
import {Round} from "../../../../mob/fight/round"
import {SkillType} from "../../../../skill/skillType"
import doNTimes from "../../../../support/functional/times"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestBuilder from "../../../../support/test/testBuilder"

let testBuilder: TestBuilder
let attacker: MobBuilder
let defender: MobBuilder
let fight: Fight
const iterations = 1000

beforeEach(async () => {
  testBuilder = new TestBuilder()
  attacker = testBuilder.withMob()
    .withSkill(SkillType.Parry, MAX_PRACTICE_LEVEL)
    .setLevel(20)
  defender = testBuilder.withMob()
  fight = await testBuilder.fight(defender.mob)
})

describe("parry event consumer", () => {
  it("parries attacks sometimes if a weapon has equipped", async () => {
    testBuilder.withWeapon()
      .asAxe()
      .equipToMobBuilder(attacker)
      .build()

    const rounds = await doNTimes(iterations, async () => {
      attacker.setHp(20)
      defender.setHp(20)
      return await fight.round()
    })

    const parried = rounds.filter((round: Round) => {
      const counter = round.getLastCounter()
      return counter.result === AttackResult.Parry
    })

    expect(parried.length).toBeGreaterThan(1)
  })

  it("should not change the outcome if no weapon has equipped", async () => {
    const rounds = await doNTimes(iterations, async () => {
      attacker.setHp(20)
      defender.setHp(20)
      return await fight.round()
    })

    const blocked = rounds.filter((round: Round) => {
      const counter = round.getLastCounter()
      return counter.result === AttackResult.Parry
    })

    expect(blocked).toHaveLength(0)
  })
})
