import {AffectType} from "../../../../affect/affectType"
import {RequestType} from "../../../../request/requestType"
import {SpellType} from "../../../../spell/spellType"
import MobBuilder from "../../../../test/mobBuilder"
import PlayerBuilder from "../../../../test/playerBuilder"
import TestBuilder from "../../../../test/testBuilder"

const expectedMessage = "you fall silent."
let testBuilder: TestBuilder
let playerBuilder: PlayerBuilder
let target: MobBuilder

beforeEach(async () => {
  testBuilder = new TestBuilder()
  playerBuilder = await testBuilder.withPlayer()
  playerBuilder.setLevel(30).addSpell(SpellType.HolySilence)
  target = testBuilder.withMob()
})

describe("holy silence spell action", () => {
  it("when successful, imparts the holy silence affect type", async () => {
    // when
    await testBuilder.successfulAction(
      testBuilder.createRequest(
        RequestType.Cast, `cast 'holy silence' ${target.getMobName()}`, target.mob))

    // then
    expect(target.hasAffect(AffectType.HolySilence)).toBeTruthy()
  })

  it("generates accurate success message casting on a target", async () => {
    // when
    const response = await testBuilder.successfulAction(
      testBuilder.createRequest(RequestType.Cast, `cast 'holy silence' ${target.getMobName()}`, target.mob))

    // then
    expect(response.getMessageToRequestCreator()).toBe(`${target.getMobName()} falls silent.`)
    expect(response.message.getMessageToTarget()).toBe(expectedMessage)
    expect(response.message.getMessageToObservers()).toBe(`${target.getMobName()} falls silent.`)
  })

  it("generates accurate success message casting on self", async () => {
    // when
    const response = await testBuilder.successfulAction(
      testBuilder.createRequest(
        RequestType.Cast,
        `cast 'holy silence' ${playerBuilder.getMobName()}`,
        playerBuilder.getMob()))

    // then
    expect(response.getMessageToRequestCreator()).toBe(expectedMessage)
    expect(response.message.getMessageToTarget()).toBe(expectedMessage)
    expect(response.message.getMessageToObservers()).toBe(`${playerBuilder.getMobName()} falls silent.`)
  })
})
