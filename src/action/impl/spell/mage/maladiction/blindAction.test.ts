import {AffectType} from "../../../../../affect/affectType"
import {MAX_PRACTICE_LEVEL} from "../../../../../mob/constants"
import {Mob} from "../../../../../mob/model/mob"
import {RequestType} from "../../../../../request/requestType"
import Response from "../../../../../request/response"
import {SpellType} from "../../../../../spell/spellType"
import doNTimes, {doNTimesOrUntilTruthy} from "../../../../../support/functional/times"
import MobBuilder from "../../../../../test/mobBuilder"
import TestBuilder from "../../../../../test/testBuilder"
import Spell from "../../../../spell"

let testBuilder: TestBuilder
let mobBuilder: MobBuilder
let mob: Mob
let spell: Spell
const iterations = 1000
const CAST_BLIND_BOB = "cast blind bob"

beforeEach(async () => {
  testBuilder = new TestBuilder()
  mobBuilder = testBuilder.withMob("alice")
  mobBuilder.setLevel(20)
  mobBuilder.withSpell(SpellType.Blind, MAX_PRACTICE_LEVEL)
  mob = testBuilder.withMob("bob").mob
  spell = await testBuilder.getSpell(SpellType.Blind)
})

function getResponses(): Promise<Response[]> {
  return doNTimes(iterations, () =>
    spell.handle(testBuilder.createRequest(RequestType.Cast, CAST_BLIND_BOB, mob)))
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
        .setLevel(20)
        .withSpell(SpellType.Blind, MAX_PRACTICE_LEVEL / 2)

      const response = await spell.handle(
        testBuilder.createRequest(RequestType.Cast, CAST_BLIND_BOB, testBuilder.withMob("bob").mob))

      return !response.isSuccessful() ? response : null
    })
    const message = failResponse.message
    expect(message.getMessageToRequestCreator()).toBe("you fail to blind bob.")
    expect(message.getMessageToTarget()).toBe("alice failed to blind you.")
    expect(message.getMessageToObservers()).toBe("alice failed to blind bob.")
  })

  it("should error out if applied twice", async () => {
    // when
    const response = await doNTimesOrUntilTruthy(iterations, async () => {
      const handled = await spell.handle(testBuilder.createRequest(RequestType.Cast, CAST_BLIND_BOB, mob))
      return handled.isError() ? handled : null
    })

    // then
    expect(response.message.getMessageToRequestCreator()).toBe("They are already blind.")
  })
})
