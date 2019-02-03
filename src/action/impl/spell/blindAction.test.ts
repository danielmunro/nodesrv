import Spell from "../../../action/spell"
import { AffectType } from "../../../affect/affectType"
import { MAX_PRACTICE_LEVEL } from "../../../mob/constants"
import { Mob } from "../../../mob/model/mob"
import { RequestType } from "../../../request/requestType"
import Response from "../../../request/response"
import { SpellType } from "../../../spell/spellType"
import doNTimes from "../../../support/functional/times"
import MobBuilder from "../../../test/mobBuilder"
import TestBuilder from "../../../test/testBuilder"

let testBuilder: TestBuilder
let mobBuilder: MobBuilder
let mob: Mob
let spell: Spell
const iterations = 10

beforeEach(async () => {
  testBuilder = new TestBuilder()
  mobBuilder = testBuilder.withMob("alice")
  mobBuilder.withLevel(20)
  mobBuilder.withSpell(SpellType.Blind, MAX_PRACTICE_LEVEL)
  mob = testBuilder.withMob("bob").mob
  spell = await testBuilder.getSpellDefinition(SpellType.Blind)
})

function getResponses(): Promise<Response[]> {
  return doNTimes(iterations, () =>
    spell.handle(testBuilder.createRequest(RequestType.Cast, "cast blind bob", mob)))
}

describe("blind spell action", () => {
  it("should impart a blinding affect on success", async () => {
    // when
    const responses = await getResponses()

    // then
    const response = responses.find(r => r.isSuccessful())
    const message = response.message
    expect(message.getMessageToRequestCreator()).toBe("you utter the words, 'blind'.")
    expect(message.getMessageToTarget()).toBe("alice utters the words, 'blind'.")
    expect(message.getMessageToObservers()).toBe("alice utters the words, 'blind'.")
    expect(mob.getAffect(AffectType.Blind)).toBeTruthy()
  })

  it("should error out if applied twice", async () => {
    // when
    const responses = await getResponses()
    responses.forEach(response => console.log(response.message.getMessageToRequestCreator()))

    // then
    const errorResponse = responses.find(r => !r.isSuccessful())
    expect(errorResponse.message.getMessageToRequestCreator()).toBe("They are already blind.")
  })
})
