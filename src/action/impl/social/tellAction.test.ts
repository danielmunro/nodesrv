import {createTestAppContainer} from "../../../app/testFactory"
import {RequestType} from "../../../request/enum/requestType"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"

describe("tell social action", () => {
  it("sanity: happy path", async () => {
    // setup
    const testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
    testRunner.createPlayer()
    const toPlayer = testRunner.createPlayer()

    // when
    const response = await testRunner.invokeAction(RequestType.Tell, `tell '${toPlayer.getMobName()}' hello world`)

    // then
    expect(response.getMessageToRequestCreator()).toEqual(`You tell ${toPlayer.getMobName()}, \"hello world\"`)
  })
})
