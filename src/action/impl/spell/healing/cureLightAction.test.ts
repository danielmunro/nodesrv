import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {Mob} from "../../../../mob/model/mob"
import {RequestType} from "../../../../request/requestType"
import {SpellType} from "../../../../spell/spellType"
import doNTimes, {doNTimesOrUntilTruthy} from "../../../../support/functional/times"
import MobBuilder from "../../../../test/mobBuilder"
import TestBuilder from "../../../../test/testBuilder"
import Spell from "../../../spell"

let testBuilder: TestBuilder
let mobBuilder: MobBuilder
let caster: Mob
let mob: Mob
let spell: Spell
const iterations = 10
const defaultMessage = "you feel better!"

beforeEach(async () => {
  testBuilder = new TestBuilder()
  mobBuilder = testBuilder.withMob("alice")
  caster = mobBuilder.mob
  mobBuilder.withLevel(20)
  mobBuilder.withSpell(SpellType.CureLight, MAX_PRACTICE_LEVEL)
  mob = testBuilder.withMob("bob").mob
  spell = await testBuilder.getSpellDefinition(SpellType.CureLight)
})

describe("cure light", () => {
  it("heals a target when casted", async () => {
    // setup
    mob.vitals.hp = 1

    // when
    const responses = await doNTimes(
      iterations,
      () => spell.handle(testBuilder.createRequest(RequestType.Cast, "cast cure bob", mob)))

    // then
    const response = responses.find(r => r.isSuccessful())
    expect(response).toBeDefined()
    expect(mob.vitals.hp).toBeGreaterThan(1)
  })

  it("heals self when casted", async () => {
    // setup
    mob.level = 30
    mob.vitals.hp = 1

    // when
    const responses = await doNTimes(
      iterations,
      () => spell.handle(testBuilder.createRequest(RequestType.Cast, "cast cure", mob)))

    // then
    const response = responses.find(r => r.isSuccessful())
    expect(response).toBeDefined()
    expect(mob.vitals.hp).toBeGreaterThan(1)
  })

  it("generates accurate success messages when casting on target", async () => {
    // when
    const response = await doNTimesOrUntilTruthy(
      iterations,
      async () => {
        const handled = await spell.handle(testBuilder.createRequest(RequestType.Cast, "cast cure bob", mob))
        return handled.isSuccessful() ? handled : null
      })

    // then
    expect(response.message.getMessageToRequestCreator()).toBe("bob feels better!")
    expect(response.message.getMessageToTarget()).toBe(defaultMessage)
    expect(response.message.getMessageToObservers()).toBe(`${mob.name} feels better!`)
  })

  it("generates accurate success messages when casting on self", async () => {
    // when
    const response = await doNTimesOrUntilTruthy(
      iterations,
      async () => {
        const handled = await spell.handle(testBuilder.createRequest(RequestType.Cast, "cast cure", caster))
        return handled.isSuccessful() ? handled : null
      })

    // then
    expect(response.message.getMessageToRequestCreator()).toBe(defaultMessage)
    expect(response.message.getMessageToTarget()).toBe(defaultMessage)
    expect(response.message.getMessageToObservers()).toBe(`${caster.name} feels better!`)
  })
})
