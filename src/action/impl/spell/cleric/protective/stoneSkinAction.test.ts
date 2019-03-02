import {AffectType} from "../../../../../affect/affectType"
import {MAX_PRACTICE_LEVEL} from "../../../../../mob/constants"
import {Mob} from "../../../../../mob/model/mob"
import {SpecializationType} from "../../../../../mob/specialization/specializationType"
import {RequestType} from "../../../../../request/requestType"
import {SpellType} from "../../../../../spell/spellType"
import {getSuccessfulAction} from "../../../../../support/functional/times"
import TestBuilder from "../../../../../test/testBuilder"
import Spell from "../../../../spell"

let testBuilder: TestBuilder
let spell: Spell
let caster: Mob
let target: Mob
const castCommand = "cast stone bob"
const responseMessage = "your skin turns to stone."

beforeEach(async () => {
  testBuilder = new TestBuilder()
  spell = await testBuilder.getSpell(SpellType.StoneSkin)
  const mobBuilder1 = testBuilder.withMob("alice", SpecializationType.Cleric)
  mobBuilder1.withSpell(SpellType.StoneSkin, MAX_PRACTICE_LEVEL)
  mobBuilder1.withLevel(30)
  const mobBuilder2 = testBuilder.withMob("bob")
  caster = mobBuilder1.mob
  target = mobBuilder2.mob
})

describe("stone skin spell action", () => {
  it("gives stone skin affect type when casted", async () => {
    // when
    await getSuccessfulAction(spell, testBuilder.createRequest(RequestType.Cast, castCommand, target))

    // then
    expect(target.getAffect(AffectType.StoneSkin)).toBeTruthy()
  })

  it("generates accurate success messages when casting on a target", async () => {
    // when
    const response = await getSuccessfulAction(spell, testBuilder.createRequest(RequestType.Cast, castCommand, target))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe("bob's skin turns to stone.")
    expect(response.message.getMessageToTarget()).toBe(responseMessage)
    expect(response.message.getMessageToObservers()).toBe("bob's skin turns to stone.")
  })

  it("generates accurate success messages when casting on self", async () => {
    // when
    const response = await getSuccessfulAction(spell, testBuilder.createRequest(RequestType.Cast, castCommand, caster))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe(responseMessage)
    expect(response.message.getMessageToTarget()).toBe(responseMessage)
    expect(response.message.getMessageToObservers()).toBe("alice's skin turns to stone.")
  })
})
