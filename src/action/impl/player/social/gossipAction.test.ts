import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {RequestType} from "../../../../messageExchange/enum/requestType"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
})

describe("gossip social action", () => {
  it("should be to handle gossiping", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Gossip, "gossip hello world")

    // then
    expect(response.getMessageToRequestCreator()).toEqual("You gossip, \"hello world\"")
  })
})
