import {createTestAppContainer} from "../../../app/factory/testFactory"
import {Client} from "../../../client/client"
import {RequestType} from "../../../request/enum/requestType"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"

let testRunner: TestRunner
let client: Client

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  client = testRunner.createClient()
  client.player = (await testRunner.createPlayer()).get()
})

describe("cc remove action", () => {
  it("can remove an added card", async () => {
    // given
    await testRunner.invokeAction(RequestType.CCAdd, "cc-add 'test debit card' 4141414141414141 1 2020")

    // when
    const response = await testRunner.invokeAction(RequestType.CCRemove, "cc-remove 'test debit card'")

    // then
    expect(response.getMessageToRequestCreator()).toBe("Payment method removed.")
  })

  it("need cards defined in order to remove a card", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.CCRemove, "cc-remove cc")

    // then
    expect(response.getMessageToRequestCreator()).toBe("no payment methods defined")
  })

  it("cannot remove cards that don't exist", async () => {
    // given
    await testRunner.invokeAction(RequestType.CCAdd, "cc-add 'test debit card' 4141414141414141 1 2020")

    // when
    const response = await testRunner.invokeAction(RequestType.CCRemove, "cc-remove foo")

    // then
    expect(response.getMessageToRequestCreator()).toBe("that payment method was not found")
  })
})
