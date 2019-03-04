import {AffectType} from "../../../../../affect/affectType"
import doNTimes from "../../../../../support/functional/times"
import PlayerBuilder from "../../../../../test/playerBuilder"
import TestBuilder from "../../../../../test/testBuilder"

let testBuilder: TestBuilder
let player: PlayerBuilder
const iterations = 100
const initialHp = 20

beforeEach(async () => {
  testBuilder = new TestBuilder()
  player = await testBuilder.withPlayer()
})

describe("sanctuary action", () => {
  it("sanctuary affect significantly reduces damage", async () => {
    player.addAffect(AffectType.Sanctuary)
    const target = testBuilder.withMob().mob
    const fight = await testBuilder.fight(target)
    let attackDamage = 0
    let counterDamage = 0
    await doNTimes(
      iterations,
      async () => {
        player.setHp(initialHp)
        target.vitals.hp = initialHp
        const round = await fight.round()
        attackDamage += round.getLastAttack().damage
        counterDamage += round.getLastCounter().damage
      })

    expect(attackDamage).toBeGreaterThan(counterDamage)
  })
})
