import {AffectType} from "../../../../affect/affectType"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {Mob} from "../../../../mob/model/mob"
import {RequestType} from "../../../../request/requestType"
import {SpellType} from "../../../../spell/spellType"
import {doNTimesOrUntilTruthy} from "../../../../support/functional/times"
import TestBuilder from "../../../../test/testBuilder"
import Spell from "../../../spell"

let testBuilder: TestBuilder
let spell: Spell
let caster: Mob
let target: Mob
const castCommand = "cast detect bob"
const responseMessage = "your eyes tingle."

beforeEach(async () => {
  testBuilder = new TestBuilder()
  spell = await testBuilder.getSpellDefinition(SpellType.DetectInvisible)
  const mobBuilder1 = testBuilder.withMob("alice")
  mobBuilder1.withSpell(SpellType.DetectInvisible, MAX_PRACTICE_LEVEL)
  mobBuilder1.withLevel(30)
  const mobBuilder2 = testBuilder.withMob("bob")
  caster = mobBuilder1.mob
  target = mobBuilder2.mob
})

describe("invisibility spell action", () => {
  it("gives invisible affect type when casted", async () => {
    // when
    await doNTimesOrUntilTruthy(100, async () => {
      const handled = await spell.handle(testBuilder.createRequest(RequestType.Cast, castCommand, target))
      return handled.isSuccessful() ? handled : null
    })

    // then
    expect(target.getAffect(AffectType.DetectInvisible)).toBeTruthy()
  })

  it("generates accurate success messages when casting on a target", async () => {
    // when
    const response = await doNTimesOrUntilTruthy(100, async () => {
      const handled = await spell.handle(testBuilder.createRequest(RequestType.Cast, castCommand, target))
      return handled.isSuccessful() ? handled : null
    })

    // then
    expect(response.message.getMessageToRequestCreator()).toBe("bob's eyes tingle.")
    expect(response.message.getMessageToTarget()).toBe(responseMessage)
    expect(response.message.getMessageToObservers()).toBe("bob's eyes tingle.")
  })

  it("generates accurate success messages when casting on self", async () => {
    // when
    const response = await doNTimesOrUntilTruthy(100, async () => {
      const handled = await spell.handle(testBuilder.createRequest(RequestType.Cast, castCommand, caster))
      return handled.isSuccessful() ? handled : null
    })

    // then
    expect(response.message.getMessageToRequestCreator()).toBe(responseMessage)
    expect(response.message.getMessageToTarget()).toBe(responseMessage)
    expect(response.message.getMessageToObservers()).toBe("alice's eyes tingle.")
  })
})
