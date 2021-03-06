import {createTestAppContainer} from "../../app/factory/testFactory"
import {Fight} from "../../mob/fight/fight"
import MobBuilder from "../../support/test/mobBuilder"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import {AffectType} from "../enum/affectType"
import {newAffect} from "../factory/affectFactory"
import {ALIGNMENT_EVIL, ALIGNMENT_GOOD} from "./protectionEventConsumer"

let attacker: MobBuilder
let target: MobBuilder
let fight: Fight

beforeEach(async () => {
  const testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  attacker = await testRunner.createMob()
  target = await testRunner.createMob()
  fight = await testRunner.fight(target.mob)
})

describe("protection event consumer", () => {
  it.each([
    [ AffectType.ProtectionGood, ALIGNMENT_GOOD + 1 ],
    [ AffectType.ProtectionEvil, ALIGNMENT_EVIL - 1 ],
    [ AffectType.ProtectionNeutral, 0 ],
  ])("modifies damage for %s",
    // @ts-ignore
    async (affectType: AffectType, alignment: number) => {
    // setup
    let attackerDamage = 0
    let defenderDamage = 0

    // given
    attacker.addAffect(newAffect(affectType))
    target.setAlignment(alignment)

    // when
    while (fight.isInProgress()) {
      const round = await fight.createFightRound()
      attackerDamage += round.getLastAttack().damage
      if (fight.isInProgress()) {
        defenderDamage += round.getLastCounter().damage
      }
    }

    // then
    expect(attackerDamage).toBeGreaterThan(defenderDamage)
  })
})
