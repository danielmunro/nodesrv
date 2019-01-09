import { AffectType } from "../../affect/affectType"
import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import { Mob } from "../../mob/model/mob"
import { RequestType } from "../../request/requestType"
import Response from "../../request/response"
import doNTimes from "../../support/functional/times"
import MobBuilder from "../../test/mobBuilder"
import TestBuilder from "../../test/testBuilder"
import SpellDefinition from "../spellDefinition"
import { SpellType } from "../spellType"

let testBuilder: TestBuilder
let mobBuilder: MobBuilder
let mob: Mob
let definition: SpellDefinition
const iterations = 10

beforeEach(async () => {
  testBuilder = new TestBuilder()
  mobBuilder = testBuilder.withMob()
  mobBuilder.withLevel(20)
  mobBuilder.withSpell(SpellType.Blind, MAX_PRACTICE_LEVEL)
  mob = testBuilder.withMob("bob").mob
  definition = await testBuilder.getSpellDefinition(SpellType.Blind)
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
    responses.forEach(response => console.log(response.message.getMessageToRequestCreator()))

    // then
    const errorResponse = responses.find(r => r.isError())
    expect(errorResponse).toBeDefined()
    expect(errorResponse.message.getMessageToRequestCreator()).toBe("They are already blind.")
  })
})
