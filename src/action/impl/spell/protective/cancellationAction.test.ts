import {AffectType} from "../../../../affect/affectType"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {RequestType} from "../../../../request/requestType"
import {SpellType} from "../../../../spell/spellType"
import {getSuccessfulAction} from "../../../../support/functional/times"
import PlayerBuilder from "../../../../support/test/playerBuilder"
import TestBuilder from "../../../../support/test/testBuilder"

let testBuilder: TestBuilder
let player: PlayerBuilder
const castInput = "cast cancel"
const expectedMessage = "you suddenly feel more normal."

beforeEach(async () => {
  testBuilder = new TestBuilder()
  player = await testBuilder.withPlayer()
  player.addSpell(SpellType.Cancellation, MAX_PRACTICE_LEVEL)
})

describe("cancellation action", () => {
  it("strips affects when casted", async () => {
    player.addAffect(AffectType.Bless)
      .addAffect(AffectType.Curse)
      .addAffect(AffectType.Poison)
      .addAffect(AffectType.Haste)
      .addAffect(AffectType.Stunned)
    const affectsCount = player.getMob().affects.length

    await getSuccessfulAction(
      await testBuilder.getAction(RequestType.Cast),
      testBuilder.createRequest(RequestType.Cast, castInput, player.getMob()))

    expect(player.getMob().affects.length).toBeLessThan(affectsCount)
  })

  it("generates correct success message", async () => {
    player.addAffect(AffectType.Bless)
      .addAffect(AffectType.Curse)
      .addAffect(AffectType.Poison)
      .addAffect(AffectType.Haste)
      .addAffect(AffectType.Stunned)

    const response = await getSuccessfulAction(
      await testBuilder.getAction(RequestType.Cast),
      testBuilder.createRequest(RequestType.Cast, castInput, player.getMob()))

    expect(response.getMessageToRequestCreator()).toBe(expectedMessage)
    expect(response.message.getMessageToTarget()).toBe(expectedMessage)
    expect(response.message.getMessageToObservers()).toBe(`${player.getMob().name} suddenly feels more normal.`)
  })

  it("generates correct success message", async () => {
    const mob = testBuilder.withMob()
    mob.addAffectType(AffectType.Bless)
      .addAffectType(AffectType.Curse)
      .addAffectType(AffectType.Poison)
      .addAffectType(AffectType.Haste)
      .addAffectType(AffectType.Stunned)

    const response = await getSuccessfulAction(
      await testBuilder.getAction(RequestType.Cast),
      testBuilder.createRequest(RequestType.Cast, `cast cancel '${mob.getMobName()}'`, mob.mob))

    expect(response.getMessageToRequestCreator()).toBe(`${mob.getMobName()} suddenly feels more normal.`)
    expect(response.message.getMessageToTarget()).toBe("you suddenly feel more normal.")
    expect(response.message.getMessageToObservers()).toBe(`${mob.getMobName()} suddenly feels more normal.`)
  })
})
