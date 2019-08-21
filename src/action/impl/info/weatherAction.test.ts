import {createTestAppContainer} from "../../../app/factory/testFactory"
import {RequestType} from "../../../messageExchange/enum/requestType"
import {weatherMessageMap} from "../../../region/constants"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"

describe("weather action", () => {
  it("describes the weather", async () => {
    // setup
    const testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)

    // when
    const response = await testRunner.invokeAction(RequestType.Weather)

    // then
    const messages = weatherMessageMap.map(map => map.message)
    expect(messages.includes(response.getMessageToRequestCreator())).toBeTruthy()
  })
})
