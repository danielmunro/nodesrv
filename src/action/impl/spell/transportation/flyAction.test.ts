import {AffectType} from "../../../../affect/affectType"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {Mob} from "../../../../mob/model/mob"
import {RequestType} from "../../../../request/requestType"
import {SpellType} from "../../../../spell/spellType"
import {getSuccessfulAction} from "../../../../support/functional/times"
import TestBuilder from "../../../../test/testBuilder"
import Spell from "../../spell"

let testBuilder: TestBuilder
let spell: Spell
let caster: Mob
let target: Mob
const castCommand = "cast fly"
const responseMessage = "your feet rise off the ground."

beforeEach(async () => {
  testBuilder = new TestBuilder()
  spell = await testBuilder.getSpell(SpellType.Fly)
  const mobBuilder1 = testBuilder.withMob()
  mobBuilder1.withSpell(SpellType.Fly, MAX_PRACTICE_LEVEL)
  mobBuilder1.setLevel(30)
  const mobBuilder2 = testBuilder.withMob()
  caster = mobBuilder1.mob
  target = mobBuilder2.mob
})

describe("fly spell action", () => {
  it("gives fly affect type when casted", async () => {
    // when
    await getSuccessfulAction(spell, testBuilder.createRequest(RequestType.Cast, castCommand, target))

    // then
    expect(target.affect().has(AffectType.Fly)).toBeTruthy()
  })

  it("generates accurate success messages when casting on a target", async () => {
    // when
    const response = await getSuccessfulAction(spell, testBuilder.createRequest(RequestType.Cast, castCommand, target))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe(`${target.name}'s feet rise off the ground.`)
    expect(response.message.getMessageToTarget()).toBe(responseMessage)
    expect(response.message.getMessageToObservers()).toBe(`${target.name}'s feet rise off the ground.`)
  })

  it("generates accurate success messages when casting on self", async () => {
    // when
    const response = await getSuccessfulAction(spell, testBuilder.createRequest(RequestType.Cast, castCommand, caster))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe(responseMessage)
    expect(response.message.getMessageToTarget()).toBe(responseMessage)
    expect(response.message.getMessageToObservers()).toBe(`${caster.name}'s feet rise off the ground.`)
  })
})
