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
let mob2: Mob

beforeEach(async () => {
  testBuilder = new TestBuilder()
  spell = await testBuilder.getSpell(SpellType.Curse)
  const mobBuilder = testBuilder.withMob().setLevel(20)
  mobBuilder.withSpell(SpellType.Curse, MAX_PRACTICE_LEVEL)
  mob2 = testBuilder.withMob().mob
})

describe("curse spell action", () => {
  it("imparts a curse on a target", async () => {
    // when
    await getSuccessfulAction(spell, testBuilder.createRequest(RequestType.Cast, `cast curse ${mob2.name}`, mob2))

    // then
    expect(mob2.affects.find(affect => affect.affectType === AffectType.Curse))
  })

  it("generates accurate success messages", async () => {
    // when
    const response = await getSuccessfulAction(
      spell, testBuilder.createRequest(RequestType.Cast, `cast curse ${mob2.name}`, mob2))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe(`${mob2.name} is cursed!`)
    expect(response.message.getMessageToTarget()).toBe(`you are cursed!`)
    expect(response.message.getMessageToObservers()).toBe(`${mob2.name} is cursed!`)
  })
})
