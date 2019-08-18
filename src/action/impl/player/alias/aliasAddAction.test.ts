import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {RequestType} from "../../../../messageExchange/enum/requestType"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"
import {Messages} from "../../../constants"

let testRunner: TestRunner
const input = "alias add foo look bar"

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  await testRunner.createPlayer()
})

describe("alias add action", () => {
  it("adds an new alias", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.AliasAdd, input)

    // then
    expect(response.getMessageToRequestCreator()).toBe("alias 'foo' added")

    // and
    const listResponse = await testRunner.invokeAction(RequestType.AliasList)

    // expect
    expect(listResponse.getMessageToRequestCreator()).toContain("look bar")
  })

  it("cannot add two aliases with the same name", async () => {
    // given
    await testRunner.invokeAction(RequestType.AliasAdd, input)

    // when
    const response = await testRunner.invokeAction(RequestType.AliasAdd, input)

    // then
    expect(response.getMessageToRequestCreator()).toBe(Messages.Alias.AliasAlreadySet)
  })

  it("can use an alias", async () => {
    // given
    await testRunner.invokeAction(RequestType.AliasAdd, input)
    const mob = await testRunner.createMob()
    mob.setName("bar")

    const response = await testRunner.invokeAction(RequestType.Look, "foo", mob.get())

    expect(response.getMessageToRequestCreator()).toBe(`a test fixture

Equipped:
`)
  })
})
