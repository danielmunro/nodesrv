import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import { RequestType } from "../../request/requestType"
import { ResponseStatus } from "../../request/responseStatus"
import spellTable from "../../spell/spellTable"
import { SpellType } from "../../spell/spellType"
import TestBuilder from "../../test/testBuilder"

describe("cast action action", () => {
  it("should be able to cast a known spell", async () => {
    const definition = spellTable.findSpell(SpellType.GiantStrength)

    // given
    const testBuilder = new TestBuilder()
    const mobBuilder = testBuilder.withMob()
    mobBuilder.withSpell(SpellType.GiantStrength, MAX_PRACTICE_LEVEL)
    mobBuilder.withLevel(20)

    // when
    const response = await definition.doAction(testBuilder.createRequest(RequestType.Cast, "cast giant"))

    // then
    expect(response.status).toBe(ResponseStatus.Success)
  })
})
