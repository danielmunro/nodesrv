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

  it("cannot add more than the max number of aliases", async () => {
    // given
    const aliases = [
      "alias add foo1 look",
      "alias add foo2 look",
      "alias add foo3 look",
      "alias add foo4 look",
      "alias add foo5 look",
      "alias add foo6 look",
      "alias add foo7 look",
      "alias add foo8 look",
      "alias add foo9 look",
      "alias add foo10 look",
      "alias add foo11 look",
    ]
    await Promise.all(aliases.map(alias => testRunner.invokeAction(RequestType.AliasAdd, alias)))

    // when
    const response = await testRunner.invokeAction(RequestType.AliasAdd, "alias add foo12 look")

    // then
    expect(response.getMessageToRequestCreator()).toBe(Messages.Alias.TooManyAliases)
  })
})
