import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {RequestType} from "../../../../messageExchange/enum/requestType"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"
import {Messages} from "../../../constants"

let testRunner: TestRunner

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  await testRunner.createPlayer()
})

describe("alias remove action", () => {
  it("removes an alias", async () => {
    // given
    await testRunner.invokeAction(RequestType.AliasAdd, "alias add foo kill bar")

    // when
    const response = await testRunner.invokeAction(RequestType.AliasRemove, "alias remove foo")

    // then
    expect(response.getMessageToRequestCreator()).toBe("alias 'foo' removed")

    // and
    const listResponse = await testRunner.invokeAction(RequestType.AliasList)

    // expect
    expect(listResponse.getMessageToRequestCreator()).not.toContain("kill bar")
  })

  it("cannot remove an alias that doesn't exist", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.AliasRemove, "alias remove foo")

    // then
    expect(response.getMessageToRequestCreator()).toBe(Messages.Alias.AliasDoesNotExist)
  })
})
