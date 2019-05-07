import {createTestAppContainer} from "../../../app/testFactory"
import {RequestType} from "../../../request/requestType"
import MobBuilder from "../../../support/test/mobBuilder"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"

let testRunner: TestRunner
let trader: MobBuilder

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  testRunner.createMob()
  trader = testRunner.createMob()
})

describe("trade request action", () => {
  it("initializes an escrow", async () => {
    const response = await testRunner.invokeAction(
        RequestType.TradeRequest,
        `trade request ${trader.getMobName()}`,
        trader.mob)

    expect(response.getMessageToRequestCreator())
      .toBe(`you would like to initiate a trade with ${trader.getMobName()}.`)
  })
})
