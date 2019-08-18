import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {RequestType} from "../../../../messageExchange/enum/requestType"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  await testRunner.createPlayer()
})

describe("alias list action", () => {
  it("lists aliases", async () => {
    // given
    await testRunner.invokeAction(RequestType.AliasAdd, "alias add foo kill bar")
    await testRunner.invokeAction(RequestType.AliasAdd, "alias add bar say who let the dogs out?")
    await testRunner.invokeAction(RequestType.AliasAdd, "alias add baz bash bar")

    // and
    const response = await testRunner.invokeAction(RequestType.AliasList)

    // expect
    expect(response.getMessageToRequestCreator()).toBe(`Your aliases:
foo: kill bar
bar: say who let the dogs out?
baz: bash bar`)
  })
})
