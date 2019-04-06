import {AffectType} from "../../../../affect/affectType"
import {newAffect} from "../../../../affect/factory"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {Mob} from "../../../../mob/model/mob"
import {RequestType} from "../../../../request/requestType"
import {SpellType} from "../../../../spell/spellType"
import {getSuccessfulAction} from "../../../../support/functional/times"
import TestBuilder from "../../../../test/testBuilder"
import Spell from "../../spell"

let testBuilder: TestBuilder
let spell: Spell
let mob: Mob
let target: Mob

const MESSAGE_FEELS_LESS_SICK = "you feel less sick."

beforeEach(async () => {
  testBuilder = new TestBuilder()
  spell = await testBuilder.getSpell(SpellType.CurePoison)
  const mobBuilder1 = testBuilder.withMob()
  mobBuilder1.withSpell(SpellType.CurePoison, MAX_PRACTICE_LEVEL)
  mobBuilder1.setLevel(20)
  mob = mobBuilder1.mob
  const mobBuilder2 = testBuilder.withMob("bob")
  target = mobBuilder2.mob
  target.addAffect(newAffect(AffectType.Poison))
})

describe("cure poison", () => {
  it("cures poison when casted", async () => {
    // when
    await getSuccessfulAction(spell, testBuilder.createRequest(RequestType.Cast, "cast cure bob", target))

    // then
    expect(target.affect().has(AffectType.Poison)).toBeFalsy()
  })

  it("generates accurate success messages for targets", async () => {
    // when
    const response = await getSuccessfulAction(
      spell, testBuilder.createRequest(RequestType.Cast, "cast cure bob", target))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe("bob feels less sick.")
    expect(response.message.getMessageToTarget()).toBe(MESSAGE_FEELS_LESS_SICK)
    expect(response.message.getMessageToObservers()).toBe("bob feels less sick.")
  })

  it("generates accurate success messages for self", async () => {
    // given
    mob.addAffect(newAffect(AffectType.Poison))

    // when
    const response = await getSuccessfulAction(spell, testBuilder.createRequest(RequestType.Cast, "cast cure", mob))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe(MESSAGE_FEELS_LESS_SICK)
    expect(response.message.getMessageToTarget()).toBe(MESSAGE_FEELS_LESS_SICK)
    expect(response.message.getMessageToObservers()).toBe(`${mob.name} feels less sick.`)
  })
})
