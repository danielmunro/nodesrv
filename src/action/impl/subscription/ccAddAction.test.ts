import {createTestAppContainer} from "../../../app/factory/testFactory"
import {Client} from "../../../client/client"
import {RequestType} from "../../../request/enum/requestType"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"

let testRunner: TestRunner
let client: Client
const expirationYearErrorMessage = "expiration year must be valid"

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  client = testRunner.createClient()
  client.player = testRunner.createPlayer().get()
})

describe("cc add action", () => {
  it("adds a credit card", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.CCAdd, "cc-add test 4141414141414141 1 2020")

    // then
    expect(response.getMessageToRequestCreator()).toBe("payment method added")
  })

  it("requires a valid expiration month", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.CCAdd, "cc-add test 4141414141414141 a 2020")

    // then
    expect(response.getMessageToRequestCreator()).toBe("expiration month required and must be a number between 1-12")
  })

  it("requires a valid expiration month again", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.CCAdd, "cc-add test 4141414141414141 15 2020")

    // then
    expect(response.getMessageToRequestCreator()).toBe("expiration month must be between 1-12")
  })

  it("requires a valid expiration year", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.CCAdd, "cc-add test 4141414141414141 12 abc")

    // then
    expect(response.getMessageToRequestCreator()).toBe("expiration year required")
  })

  it("requires a valid expiration year, cannot be in the past", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.CCAdd, "cc-add test 4141414141414141 12 2018")

    // then
    expect(response.getMessageToRequestCreator()).toBe(expirationYearErrorMessage)
  })

  it("requires a valid expiration year, cannot be too far in the future", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.CCAdd, "cc-add test 4141414141414141 12 2040")

    // then
    expect(response.getMessageToRequestCreator()).toBe(expirationYearErrorMessage)
  })
})
