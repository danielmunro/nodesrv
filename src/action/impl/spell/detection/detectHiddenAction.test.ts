import {AffectType} from "../../../../affect/affectType"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {Mob} from "../../../../mob/model/mob"
import {RequestType} from "../../../../request/requestType"
import {SpellType} from "../../../../spell/spellType"
import {getSuccessfulAction} from "../../../../support/functional/times"
import TestBuilder from "../../../../support/test/testBuilder"
import Spell from "../../spell"

let testBuilder: TestBuilder
let spell: Spell
let caster: Mob
let target: Mob
const castCommand = "cast 'detect hidden'"
const responseMessage = "your eyes tingle."

beforeEach(async () => {
  testBuilder = new TestBuilder()
  spell = await testBuilder.getSpell(SpellType.DetectHidden)
  const mobBuilder1 = testBuilder.withMob()
    .withSpell(SpellType.DetectHidden, MAX_PRACTICE_LEVEL)
    .setLevel(30)
  const mobBuilder2 = testBuilder.withMob()
  caster = mobBuilder1.mob
  target = mobBuilder2.mob
})

describe("detect hidden spell action", () => {
  it("gives detect hidden affect type when casted", async () => {
    // when
    await getSuccessfulAction(spell, testBuilder.createRequest(RequestType.Cast, castCommand, caster))

    // then
    expect(caster.affect().has(AffectType.DetectHidden)).toBeTruthy()
  })

  it("generates accurate success messages when casting on a target", async () => {
    // when
    const response = await getSuccessfulAction(spell, testBuilder.createRequest(RequestType.Cast, castCommand, target))

    // then
    expect(response.getMessageToRequestCreator()).toBe(`${target.name}'s eyes tingle.`)
    expect(response.message.getMessageToTarget()).toBe(responseMessage)
    expect(response.message.getMessageToObservers()).toBe(`${target.name}'s eyes tingle.`)
  })

  it("generates accurate success messages when casting on self", async () => {
    // when
    const response = await getSuccessfulAction(spell, testBuilder.createRequest(RequestType.Cast, castCommand, caster))

    // then
    expect(response.getMessageToRequestCreator()).toBe(responseMessage)
    expect(response.message.getMessageToTarget()).toBe(responseMessage)
    expect(response.message.getMessageToObservers()).toBe(`${caster.name}'s eyes tingle.`)
  })
})
