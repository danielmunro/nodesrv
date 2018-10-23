import { AffectType } from "../../affect/affectType"
import doNTimes from "../../functional/times"
import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import spellTable from "../spellTable"
import { SpellType } from "../spellType"
import MobBuilder from "../../test/mobBuilder"
import { Mob } from "../../mob/model/mob"
import Response from "../../request/response"

let testBuilder: TestBuilder
let mobBuilder: MobBuilder
let mob: Mob
const definition = spellTable.findSpell(SpellType.Blind)
const iterations = 10

beforeEach(() => {
  testBuilder = new TestBuilder()
  mobBuilder = testBuilder.withMob()
  mobBuilder.withLevel(20)
  mobBuilder.withSpell(SpellType.Blind, MAX_PRACTICE_LEVEL)
  mob = testBuilder.withMob("bob").mob
})

function getResponses(): Promise<Response[]> {
  return doNTimes(iterations, () =>
    definition.doAction(testBuilder.createRequest(RequestType.Cast, "cast blind bob", mob)))
}

describe("blind spell action", () => {
  it("should impart a blinding affect on success", async () => {
    // when
    const responses = await getResponses()

    // then
    const response = responses.find(r => r.isSuccessful())
    expect(response).toBeTruthy()
    expect(response.message.getMessageToRequestCreator()).toBe("bob is suddenly blind!")
    expect(response.message.getMessageToTarget()).toBe("you are suddenly blind!")
    expect(response.message.getMessageToObservers()).toBe("bob is suddenly blind!")
    expect(mob.getAffect(AffectType.Blind)).toBeTruthy()
  })

  it("should error out if applied twice", async () => {
    // when
    const responses = await getResponses()

    // then
    const errorResponse = responses.find(r => !r.isSuccessful())
    expect(errorResponse).toBeTruthy()
    expect(errorResponse.isError()).toBeTruthy()
    expect(errorResponse.message.getMessageToRequestCreator()).toBe("They are already blind.")
  })
})
