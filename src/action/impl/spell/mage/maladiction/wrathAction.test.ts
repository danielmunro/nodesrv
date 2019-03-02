import {AffectType} from "../../../../affect/affectType"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {Mob} from "../../../../mob/model/mob"
import {RequestType} from "../../../../request/requestType"
import {SpellType} from "../../../../spell/spellType"
import {getSuccessfulAction} from "../../../../support/functional/times"
import TestBuilder from "../../../../test/testBuilder"
import Spell from "../../../spell"

let testBuilder: TestBuilder
let spell: Spell
let target: Mob

beforeEach(async () => {
  testBuilder = new TestBuilder()
  spell = await testBuilder.getSpell(SpellType.Wrath)
  const mobBuilder1 = testBuilder.withMob()
  mobBuilder1.withSpell(SpellType.Wrath, MAX_PRACTICE_LEVEL)
  mobBuilder1.withLevel(30)
  const mobBuilder2 = testBuilder.withMob()
  target = mobBuilder2.mob
})

describe("wrath action", () => {
  it("imparts wrath affect", async () => {
    await getSuccessfulAction(
      spell, testBuilder.createRequest(RequestType.Cast, `cast wrath ${target.name}`, target))

    expect(target.getAffect(AffectType.Wrath)).toBeDefined()
  })

  it("generates accurate success messages", async () => {
    const response = await getSuccessfulAction(
      spell, testBuilder.createRequest(RequestType.Cast, `cast wrath ${target.name}`, target))

    expect(response.message.getMessageToRequestCreator()).toBe(`${target.name} is surrounded by wrathful energy.`)
    expect(response.message.getMessageToTarget()).toBe(`you are surrounded by wrathful energy.`)
    expect(response.message.getMessageToObservers()).toBe(`${target.name} is surrounded by wrathful energy.`)
  })
})
