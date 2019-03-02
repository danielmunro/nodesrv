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
  spell = await testBuilder.getSpell(SpellType.Poison)
  const mobBuilder1 = testBuilder.withMob()
  mobBuilder1.withSpell(SpellType.Poison, MAX_PRACTICE_LEVEL)
  mobBuilder1.withLevel(30)
  const mobBuilder2 = testBuilder.withMob("bob")
  target = mobBuilder2.mob
})

describe("poison spell action", () => {
  it("imparts poison on success", async () => {
    // when
    await getSuccessfulAction(spell, testBuilder.createRequest(RequestType.Cast, "cast poison bob", target))

    // then
    expect(target.getAffect(AffectType.Poison)).toBeTruthy()
  })

  it("generates accurate success messages", async () => {
    // when
    const response = await getSuccessfulAction(
      spell, testBuilder.createRequest(RequestType.Cast, "cast poison bob", target))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe("bob suddenly feels sick!")
    expect(response.message.getMessageToTarget()).toBe("you suddenly feel sick!")
    expect(response.message.getMessageToObservers()).toBe("bob suddenly feels sick!")
  })
})
