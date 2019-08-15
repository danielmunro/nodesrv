import {AffectType} from "../../../../affect/enum/affectType"
import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {RequestType} from "../../../../messageExchange/enum/requestType"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {Round} from "../../../../mob/fight/round"
import {SpellType} from "../../../../mob/spell/spellType"
import doNTimes from "../../../../support/functional/times"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

const ITERATIONS = 1000
const maxHp = 20
const expectedMessage = "you are ready for holy battle!"
let testRunner: TestRunner
let caster: MobBuilder

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  caster = (await testRunner.createMob())
    .setLevel(30)
    .withSpell(SpellType.Crusade, MAX_PRACTICE_LEVEL)
})

describe("crusade spell action", () => {
  it("periodically invokes an additional attack", async () => {
    // setup
    caster.addAffectType(AffectType.Crusade)
    const target = (await testRunner.createMob())
      .setLevel(30)

    // given
    const fight = await testRunner.fight(target.mob)

    // when
    const rounds = await doNTimes(ITERATIONS, () => {
      caster.setHp(maxHp)
      target.setHp(maxHp)
      return fight.round()
    })

    // then
    expect(rounds.filter((round: Round) => round.attacks.length > 1).length).toBeGreaterThan(0)
  })

  it("when successful, imparts the crusade affect type", async () => {
    // when
    await testRunner.invokeActionSuccessfully(RequestType.Cast, "cast crusade", caster.get())

    // then
    expect(caster.hasAffect(AffectType.Crusade)).toBeTruthy()
  })

  it("generates accurate success message casting on self", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(
      RequestType.Cast, "cast crusade", caster.get())

    // then
    expect(response.getMessageToRequestCreator()).toBe(expectedMessage)
    expect(response.getMessageToTarget()).toBe(expectedMessage)
    expect(response.getMessageToObservers()).toBe(`${caster.get()} is ready for holy battle!`)
  })

  it("generates accurate success message casting on a target", async () => {
    // given
    const target = await testRunner.createMob()

    // when
    const response = await testRunner.invokeActionSuccessfully(
      RequestType.Cast, `cast crusade ${target.getMobName()}`, target.get())

    // then
    expect(response.getMessageToRequestCreator()).toBe(`${target.mob} is ready for holy battle!`)
    expect(response.getMessageToTarget()).toBe(expectedMessage)
    expect(response.getMessageToObservers()).toBe(`${target.mob} is ready for holy battle!`)
  })
})
