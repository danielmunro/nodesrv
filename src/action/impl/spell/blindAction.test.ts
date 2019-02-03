import Spell from "../../../action/spell"
import {AffectType} from "../../../affect/affectType"
import {MAX_PRACTICE_LEVEL} from "../../../mob/constants"
import {Mob} from "../../../mob/model/mob"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import {SpellType} from "../../../spell/spellType"
import doNTimes, {doNTimesOrUntilTruthy} from "../../../support/functional/times"
import MobBuilder from "../../../test/mobBuilder"
import TestBuilder from "../../../test/testBuilder"

let testBuilder: TestBuilder
let mobBuilder: MobBuilder
let mob: Mob
let spell: Spell
const iterations = 100

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
    if (!response) {
      return fail("expected successful response")
    }
    expect(mob.getAffect(AffectType.Blind)).toBeTruthy()
  })

  it("generates accurate success messages", async () => {
    // when
    const responses = await getResponses()

    // then
    const response = responses.find(r => r.isSuccessful())
    if (!response) {
      return fail("expected successful response")
    }
    const message = response.message
    expect(message.getMessageToRequestCreator()).toBe("bob is suddenly blind!")
    expect(message.getMessageToTarget()).toBe("you are suddenly blind!")
    expect(message.getMessageToObservers()).toBe("bob is suddenly blind!")
  })

  it("generates accurate fail messages", async () => {
    const failResponse = await doNTimesOrUntilTruthy(iterations, async () => {
      testBuilder = new TestBuilder()
      testBuilder
        .withMob("alice")
        .withLevel(20)
        .withSpell(SpellType.Blind, MAX_PRACTICE_LEVEL / 2)

      const response = await spell.handle(
        testBuilder.createRequest(RequestType.Cast, "cast blind bob", testBuilder.withMob("bob").mob))

      return !response.isSuccessful() ? response : null
    })
    const message = failResponse.message
    expect(message.getMessageToRequestCreator()).toBe("you fail to blind bob.")
    expect(message.getMessageToTarget()).toBe("alice failed to blind you.")
    expect(message.getMessageToObservers()).toBe("alice failed to blind bob.")
  })

  it("should error out if applied twice", async () => {
    // when
    const responses = await getResponses()
    responses.forEach(response => console.log(response.message.getMessageToRequestCreator()))

    // then
    const errorResponse = responses.find(r => !r.isSuccessful())
    if (!errorResponse) {
      return fail("expected unsuccessful response")
    }
    expect(errorResponse.message.getMessageToRequestCreator()).toBe("They are already blind.")
  })
})
