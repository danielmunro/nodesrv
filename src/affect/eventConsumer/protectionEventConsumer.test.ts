import {Fight} from "../../mob/fight/fight"
import MobBuilder from "../../test/mobBuilder"
import TestBuilder from "../../test/testBuilder"
import {AffectType} from "../affectType"
import {newAffect} from "../factory"
import {ALIGNMENT_EVIL, ALIGNMENT_GOOD} from "./protectionEventConsumer"

let testBuilder: TestBuilder
let attacker: MobBuilder
let target: MobBuilder
let fight: Fight

beforeEach(async () => {
  testBuilder = new TestBuilder()
  attacker = testBuilder.withMob()
  target = testBuilder.withMob()
  fight = await testBuilder.fight(target.mob)
})

describe("protection event consumer", () => {
  it.each([
    [ AffectType.ProtectionGood, ALIGNMENT_GOOD + 1 ],
    [ AffectType.ProtectionEvil, ALIGNMENT_EVIL - 1 ],
    [ AffectType.ProtectionNeutral, 0 ],
  ])("modifies damage for %s", async (affectType: AffectType, alignment: number) => {
    // setup
    let attackerDamage = 0
    let defenderDamage = 0

    // given
    attacker.addAffect(newAffect(affectType))
    target.setAlignment(alignment)

    // when
    while (fight.isInProgress()) {
      const round = await fight.round()
      attackerDamage += round.getLastAttack().damage
      if (fight.isInProgress()) {
        defenderDamage += round.getLastCounter().damage
      }
    }

    // then
    expect(attackerDamage).toBeGreaterThan(defenderDamage)
  })
})
