import {AffectType} from "../../../../../affect/affectType"
import {newAffect} from "../../../../../affect/factory"
import {MAX_PRACTICE_LEVEL} from "../../../../../mob/constants"
import {Mob} from "../../../../../mob/model/mob"
import {RequestType} from "../../../../../request/requestType"
import {SpellMessages} from "../../../../../spell/constants"
import {SpellType} from "../../../../../spell/spellType"
import {getSuccessfulAction} from "../../../../../support/functional/times"
import TestBuilder from "../../../../../test/testBuilder"
import Spell from "../../../../spell"

let testBuilder: TestBuilder
let spell: Spell
let mob: Mob
let target: Mob

const expectedMessage = "your curse is lifted."

beforeEach(async () => {
  testBuilder = new TestBuilder()
  spell = await testBuilder.getSpell(SpellType.RemoveCurse)
  const mobBuilder1 = testBuilder.withMob()
  mobBuilder1.withSpell(SpellType.RemoveCurse, MAX_PRACTICE_LEVEL)
  mobBuilder1.setLevel(20)
  mob = mobBuilder1.mob
  const mobBuilder2 = testBuilder.withMob()
  target = mobBuilder2.mob
  target.addAffect(newAffect(AffectType.Curse))
})

describe("remove curse spell action", () => {
  it("can remove a curse", async () => {
    // when
    await getSuccessfulAction(spell, testBuilder.createRequest(RequestType.Cast, `cast remove ${target.name}`, target))

    // then
    expect(target.getAffect(AffectType.Curse)).toBeFalsy()
  })

  it("requires a curse in the first place", async () => {
    // when
    const response = await testBuilder.handleAction(RequestType.Cast, `cast remove`, mob)

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(SpellMessages.RemoveCurse.RequiresAffect)
  })

  it("generates accurate success messages for targets", async () => {
    // when
    const response = await getSuccessfulAction(
      spell, testBuilder.createRequest(RequestType.Cast, `cast remove ${target.name}`, target))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe(`${target.name}'s curse is lifted.`)
    expect(response.message.getMessageToTarget()).toBe(expectedMessage)
    expect(response.message.getMessageToObservers()).toBe(`${target.name}'s curse is lifted.`)
  })

  it("generates accurate success messages for self", async () => {
    // given
    mob.addAffect(newAffect(AffectType.Curse))

    // when
    const response = await getSuccessfulAction(spell, testBuilder.createRequest(RequestType.Cast, "cast remove", mob))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe(expectedMessage)
    expect(response.message.getMessageToTarget()).toBe(expectedMessage)
    expect(response.message.getMessageToObservers()).toBe(`${mob.name}'s curse is lifted.`)
  })
})
