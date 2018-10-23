import { AffectType } from "../../affect/affectType"
import doNTimes from "../../functional/times"
import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import spellTable from "../spellTable"
import { SpellType } from "../spellType"

describe("blind spell action", () => {
  it("should impart a blinding affect on success", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const mobBuilder = testBuilder.withMob()

    // given
    mobBuilder.withLevel(20)
    mobBuilder.withSpell(SpellType.Blind, MAX_PRACTICE_LEVEL)
    const mob = testBuilder.withMob("bob").mob
    const definition = spellTable.findSpell(SpellType.Blind)

    // when
    const responses = await doNTimes(10, () =>
      definition.doAction(testBuilder.createRequest(RequestType.Cast, "cast blind bob", mob)))

    // then
    const response = responses.find(r => r.isSuccessful())
    expect(response).toBeTruthy()
    expect(response.message.getMessageToRequestCreator()).toBe("bob is suddenly blind!")
    expect(response.message.getMessageToTarget()).toBe("you are suddenly blind!")
    expect(response.message.getMessageToObservers()).toBe("bob is suddenly blind!")
    expect(mob.getAffect(AffectType.Blind)).toBeTruthy()

    // and
    const errorResponse = responses.find(r => !r.isSuccessful())
    expect(errorResponse).toBeTruthy()
    expect(errorResponse.isError()).toBeTruthy()
    expect(errorResponse.message.getMessageToRequestCreator()).toBe("They are already blind.")
  })
})
