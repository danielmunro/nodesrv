import {AffectType} from "../../../../affect/affectType"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {Mob} from "../../../../mob/model/mob"
import {SpecializationType} from "../../../../mob/specialization/specializationType"
import {RequestType} from "../../../../request/requestType"
import {SpellType} from "../../../../spell/spellType"
import {doNTimesOrUntilTruthy} from "../../../../support/functional/times"
import TestBuilder from "../../../../test/testBuilder"
import Spell from "../../../spell"

let testBuilder: TestBuilder
let spell: Spell
let caster: Mob
let mob: Mob

const RESPONSE1 = "your muscles surge with heightened power."

beforeEach(async () => {
  testBuilder = new TestBuilder()
  spell = await testBuilder.getSpellDefinition(SpellType.GiantStrength)
  const mobBuilder1 = testBuilder.withMob("alice", SpecializationType.Cleric)
  mobBuilder1.withSpell(SpellType.GiantStrength, MAX_PRACTICE_LEVEL)
  mobBuilder1.withLevel(30)
  caster = mobBuilder1.mob
  const mobBuilder2 = testBuilder.withMob("bob")
  mob = mobBuilder2.mob
})

describe("giant strength spell action", () => {
  it("imparts the giant strength affect", async () => {
    // when
    await doNTimesOrUntilTruthy(
      100,
      async () => {
        const response = await spell.handle(testBuilder.createRequest(RequestType.Cast, "cast giant bob", mob))
        return response.isSuccessful()
      })

    // then
    expect(mob.getAffect(AffectType.GiantStrength)).toBeTruthy()
  })

  it("generates accurate success messages when casting against a target", async () => {
    // when
    const response = await doNTimesOrUntilTruthy(
      100,
      async () => {
        const handled = await spell.handle(testBuilder.createRequest(RequestType.Cast, "cast giant bob", mob))
        return handled.isSuccessful() ? handled : null
      })

    // then
    expect(response.message.getMessageToRequestCreator()).toBe("bob's muscles surge with heightened power.")
    expect(response.message.getMessageToTarget()).toBe(RESPONSE1)
    expect(response.message.getMessageToObservers()).toBe("bob's muscles surge with heightened power.")
  })

  it("generates accurate success messages when casting on self", async () => {
    // when
    const response = await doNTimesOrUntilTruthy(
      100,
      async () => {
        const handled = await spell.handle(testBuilder.createRequest(RequestType.Cast, "cast giant", caster))
        return handled.isSuccessful() ? handled : null
      })

    // then
    expect(response.message.getMessageToRequestCreator()).toBe(RESPONSE1)
    expect(response.message.getMessageToTarget()).toBe(RESPONSE1)
    expect(response.message.getMessageToObservers()).toBe(`alice's muscles surge with heightened power.`)
  })
})
