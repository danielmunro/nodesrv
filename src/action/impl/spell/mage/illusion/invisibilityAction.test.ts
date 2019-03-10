import {AffectType} from "../../../../../affect/affectType"
import {MAX_PRACTICE_LEVEL} from "../../../../../mob/constants"
import {Mob} from "../../../../../mob/model/mob"
import {RequestType} from "../../../../../request/requestType"
import {SpellType} from "../../../../../spell/spellType"
import {getSuccessfulAction} from "../../../../../support/functional/times"
import TestBuilder from "../../../../../test/testBuilder"
import Spell from "../../../../spell"

let testBuilder: TestBuilder
let spell: Spell
let caster: Mob
let target: Mob
const castCommand = "cast invis bob"
const responseMessage = "you fade out of existence."

beforeEach(async () => {
  testBuilder = new TestBuilder()
  spell = await testBuilder.getSpell(SpellType.Invisibility)
  const mobBuilder1 = testBuilder.withMob("alice")
  mobBuilder1.withSpell(SpellType.Invisibility, MAX_PRACTICE_LEVEL)
  mobBuilder1.setLevel(30)
  const mobBuilder2 = testBuilder.withMob("bob")
  caster = mobBuilder1.mob
  target = mobBuilder2.mob
})

describe("invisibility spell action", () => {
  it("gives invisible affect type when casted", async () => {
    // when
    await getSuccessfulAction(spell, testBuilder.createRequest(RequestType.Cast, castCommand, target))

    // then
    expect(target.getAffect(AffectType.Invisible)).toBeTruthy()
  })

  it("generates accurate success messages when casting on a target", async () => {
    // when
    const response = await getSuccessfulAction(spell, testBuilder.createRequest(RequestType.Cast, castCommand, target))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe("bob fades out of existence.")
    expect(response.message.getMessageToTarget()).toBe(responseMessage)
    expect(response.message.getMessageToObservers()).toBe("bob fades out of existence.")
  })

  it("generates accurate success messages when casting on self", async () => {
    // when
    const response = await getSuccessfulAction(spell, testBuilder.createRequest(RequestType.Cast, castCommand, caster))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe(responseMessage)
    expect(response.message.getMessageToTarget()).toBe(responseMessage)
    expect(response.message.getMessageToObservers()).toBe("alice fades out of existence.")
  })
})
