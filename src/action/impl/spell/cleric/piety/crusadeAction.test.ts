import {AffectType} from "../../../../../affect/affectType"
import {Round} from "../../../../../mob/fight/round"
import {RequestType} from "../../../../../request/requestType"
import {SpellType} from "../../../../../spell/spellType"
import doNTimes, {getSuccessfulAction} from "../../../../../support/functional/times"
import PlayerBuilder from "../../../../../test/playerBuilder"
import TestBuilder from "../../../../../test/testBuilder"

const ITERATIONS = 1000
const maxHp = 20
const expectedMessage = "you are ready for holy battle!"
let testBuilder: TestBuilder
let playerBuilder: PlayerBuilder

beforeEach(async () => {
  testBuilder = new TestBuilder()
  playerBuilder = await testBuilder.withPlayer()
  playerBuilder.setLevel(30).addSpell(SpellType.Crusade)
})

describe("crusade spell action", () => {
  it("periodically invokes an additional attack", async () => {
    // setup
    const target = testBuilder.withMob().withLevel(30)

    // given
    const fight = await testBuilder.fight(target.mob)

    // when
    const rounds = await doNTimes(ITERATIONS, () => {
      playerBuilder.setHp(maxHp)
      target.setHp(maxHp)
      return fight.round()
    })

    // then
    expect(rounds.filter((round: Round) => round.attacks.length > 1).length).toBeGreaterThan(0)
  })

  it("when successful, imparts the crusade affect type", async () => {
    // when
    await getSuccessfulAction(
      await testBuilder.getAction(RequestType.Cast),
      testBuilder.createRequest(RequestType.Cast, "cast crusade", playerBuilder.getMob()))

    // then
    expect(playerBuilder.getMob().getAffect(AffectType.Crusade)).toBeDefined()
  })

  it("generates accurate success message casting on self", async () => {
    // when
    const response = await getSuccessfulAction(
      await testBuilder.getAction(RequestType.Cast),
      testBuilder.createRequest(RequestType.Cast, "cast crusade", playerBuilder.getMob()))

    // then
    expect(response.getMessageToRequestCreator()).toBe(expectedMessage)
    expect(response.message.getMessageToTarget()).toBe(expectedMessage)
    expect(response.message.getMessageToObservers()).toBe(`${playerBuilder.getMob()} is ready for holy battle!`)
  })

  it("generates accurate success message casting on a target", async () => {
    // given
    const target = testBuilder.withMob()

    // when
    const response = await getSuccessfulAction(
      await testBuilder.getAction(RequestType.Cast),
      testBuilder.createRequest(RequestType.Cast, `cast crusade ${target.mob}`, target.mob))

    // then
    expect(response.getMessageToRequestCreator()).toBe(`${target.mob} is ready for holy battle!`)
    expect(response.message.getMessageToTarget()).toBe(expectedMessage)
    expect(response.message.getMessageToObservers()).toBe(`${target.mob} is ready for holy battle!`)
  })
})
