import {AffectType} from "../../../../affect/affectType"
import {createTestAppContainer} from "../../../../inversify.config"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {RequestType} from "../../../../request/requestType"
import {SpellType} from "../../../../spell/spellType"
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
  caster = testRunner.createMob()
})

describe("sanctuary action", () => {
  it("sanctuary affect significantly reduces damage", async () => {
    // given
    caster.addAffectType(AffectType.Sanctuary)
    const target = testRunner.createMob()
    const fight = testRunner.fight(target.get())
    let attackDamage = 0
    let counterDamage = 0

    // when
    await doNTimes(
      iterations,
      async () => {
        caster.setHp(initialHp)
        target.setHp(initialHp)
        const round = await fight.round()
        attackDamage += round.getLastAttack().damage
        counterDamage += round.getLastCounter().damage
      })

    // then
    expect(attackDamage).toBeGreaterThan(counterDamage)
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
    const target = testRunner.createMob()

    // when
    const response = await testRunner.invokeActionSuccessfully(
      RequestType.Cast, `cast sanctuary ${target.getMobName()}`, target.get())

    // then
    expect(response.getMessageToRequestCreator()).toBe(`${target.getMobName()} is surrounded by a faint glow.`)
    expect(response.getMessageToTarget()).toBe(expectedResponse)
    expect(response.getMessageToObservers()).toBe(`${target.getMobName()} is surrounded by a faint glow.`)
  })
})
