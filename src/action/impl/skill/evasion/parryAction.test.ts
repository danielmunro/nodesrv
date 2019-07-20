import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {AttackResult} from "../../../../mob/fight/enum/attackResult"
import {Fight} from "../../../../mob/fight/fight"
import {Round} from "../../../../mob/fight/round"
import {SkillType} from "../../../../mob/skill/skillType"
import doNTimes from "../../../../support/functional/times"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner
let attacker: MobBuilder
let defender: MobBuilder
let fight: Fight
const iterations = 1000

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  attacker = (await testRunner.createMob())
    .withSkill(SkillType.Parry, MAX_PRACTICE_LEVEL)
    .setLevel(20)
  defender = await testRunner.createMob()
  fight = await testRunner.fight(defender.mob)
})

describe("parry event consumer", () => {
  it("parries attacks sometimes if a weapon is equipped", async () => {
    attacker.equip(testRunner.createWeapon()
      .asAxe()
      .build())

    const rounds = await doNTimes(iterations, async () => {
      attacker.setHp(20)
      defender.setHp(20)
      return fight.round()
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
