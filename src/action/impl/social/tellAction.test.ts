import {createTestAppContainer} from "../../../app/factory/testFactory"
import {RequestType} from "../../../messageExchange/enum/requestType"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"

describe("tell social action", () => {
  it("sanity: happy path", async () => {
    // setup
    const testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
    await testRunner.createPlayer()
    const toPlayer = await testRunner.createPlayer()

    // when
    const response = await testRunner.invokeAction(RequestType.Tell, `tell '${toPlayer.getMobName()}' hello world`)

    // then
    expect(response.getMessageToRequestCreator()).toEqual(`You tell ${toPlayer.getMobName()}, \"hello world\"`)
  })
})
