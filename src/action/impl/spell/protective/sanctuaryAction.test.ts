import {AffectType} from "../../../../affect/enum/affectType"
import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {RequestType} from "../../../../messageExchange/enum/requestType"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {SpellType} from "../../../../mob/spell/spellType"
import doNTimes from "../../../../support/functional/times"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner
let caster: MobBuilder
const iterations = 100
const initialHp = 20
const expectedResponse = "you are surrounded by a faint glow."

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  caster = await testRunner.createMob()
})

describe("sanctuary action", () => {
  it("sanctuary affect significantly reduces damage", async () => {
    // given
    caster.addAffectType(AffectType.Sanctuary)
    const target = await testRunner.createMob()
    const fight = await testRunner.fight(target.get())
    let attackDamage = 0
    let counterDamage = 0

    // when
    await doNTimes(
      iterations,
      async () => {
        caster.setHp(initialHp)
        target.setHp(initialHp)
        const round = await fight.createFightRound()
        attackDamage += round.getLastAttack().damage
        counterDamage += round.getLastCounter().damage
      })

    // then
    expect(attackDamage).toBeGreaterThan(counterDamage * 0.75)
  })

  it("generates accurate success messages on self", async () => {
    // given
    caster.withSpell(SpellType.Sanctuary, MAX_PRACTICE_LEVEL)

    // when
    const response = await testRunner.invokeActionSuccessfully(
      RequestType.Cast, "cast sanctuary", caster.get())

    // then
    expect(response.getMessageToRequestCreator()).toBe(expectedResponse)
    expect(response.message.getMessageToTarget()).toBe(expectedResponse)
    expect(response.message.getMessageToObservers()).toBe(`${caster.getMobName()} is surrounded by a faint glow.`)
  })

  it("generates accurate success messages on a target", async () => {
    // given
    caster.withSpell(SpellType.Sanctuary, MAX_PRACTICE_LEVEL)
    const target = await testRunner.createMob()

    // when
    const response = await testRunner.invokeActionSuccessfully(
      RequestType.Cast, `cast sanctuary ${target.getMobName()}`, target.get())

    // then
    expect(response.getMessageToRequestCreator()).toBe(`${target.getMobName()} is surrounded by a faint glow.`)
    expect(response.getMessageToTarget()).toBe(expectedResponse)
    expect(response.getMessageToObservers()).toBe(`${target.getMobName()} is surrounded by a faint glow.`)
  })
})
