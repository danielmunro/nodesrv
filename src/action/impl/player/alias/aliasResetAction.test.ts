import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {RequestType} from "../../../../messageExchange/enum/requestType"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  await testRunner.createPlayer()
})

describe("alias reset action", () => {
  it("deletes all aliases", async () => {
    // given
    await testRunner.invokeAction(RequestType.AliasAdd, "alias add foo kill bar")
    await testRunner.invokeAction(RequestType.AliasAdd, "alias add bar say who let the dogs out?")
    await testRunner.invokeAction(RequestType.AliasAdd, "alias add baz bash bar")

    // and
    const resetResponse = await testRunner.invokeAction(RequestType.AliasReset)

    // expect
    expect(resetResponse.getMessageToRequestCreator()).toBe("all aliases removed")

    // and
    const listResponse = await testRunner.invokeAction(RequestType.AliasList)

    // then
    expect(listResponse.getMessageToRequestCreator()).toBe("Your aliases:")
  })
})
