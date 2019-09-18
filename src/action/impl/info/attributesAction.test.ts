import {createTestAppContainer} from "../../../app/factory/testFactory"
import {RequestType} from "../../../messageExchange/enum/requestType"
import {RaceType} from "../../../mob/race/enum/raceType"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"

describe("attributes action", () => {
  it("reports attributes", async () => {
    // setup
    const testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
    const mob = await testRunner.createMob()

    // given
    mob.setRace(RaceType.Faerie)

    // when
    const response = await testRunner.invokeAction(RequestType.Attributes)

    // then
    expect(response.getMessageToRequestCreator()).toBe("Str: 13 Int: 17 Wis: 17 Dex: 16 Con: 13 Sta: 14")
  })
})
