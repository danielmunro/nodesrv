import {AffectType} from "../../../../affect/affectType"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {RequestType} from "../../../../request/requestType"
import {SpellType} from "../../../../spell/spellType"
import doNTimes, {getSuccessfulAction} from "../../../../support/functional/times"
import PlayerBuilder from "../../../../test/playerBuilder"
import TestBuilder from "../../../../test/testBuilder"

let testBuilder: TestBuilder
let player: PlayerBuilder
const iterations = 100
const initialHp = 20
const expectedResponse = "you are surrounded by a faint glow."

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

  it("generates accurate success messages on self", async () => {
    player.addSpell(SpellType.Sanctuary, MAX_PRACTICE_LEVEL)

    const response = await getSuccessfulAction(
      await testBuilder.getAction(RequestType.Cast),
      testBuilder.createRequest(RequestType.Cast, "cast sanctuary", player.getMob()))

    expect(response.getMessageToRequestCreator()).toBe(expectedResponse)
    expect(response.message.getMessageToTarget()).toBe(expectedResponse)
    expect(response.message.getMessageToObservers()).toBe(`${player.getMob().name} is surrounded by a faint glow.`)
  })

  it("generates accurate success messages on a target", async () => {
    player.addSpell(SpellType.Sanctuary, MAX_PRACTICE_LEVEL)
    const target = testBuilder.withMob()

    const response = await getSuccessfulAction(
      await testBuilder.getAction(RequestType.Cast),
      testBuilder.createRequest(RequestType.Cast, `cast sanctuary ${target.getMobName()}`, target.mob))

    expect(response.getMessageToRequestCreator()).toBe(`${target.getMobName()} is surrounded by a faint glow.`)
    expect(response.message.getMessageToTarget()).toBe(expectedResponse)
    expect(response.message.getMessageToObservers()).toBe(`${target.getMobName()} is surrounded by a faint glow.`)
  })
})
