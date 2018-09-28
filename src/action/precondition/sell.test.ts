import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import { CheckStatus } from "../../check/checkStatus"
import { MESSAGE_FAIL_ITEM_NOT_IN_INVENTORY, MESSAGE_FAIL_NO_MERCHANT } from "./constants"
import sell from "./sell"

describe("sell actions actions precondition", () => {
  it("should fail if a merchant is not in the room", async () => {
    // setup
    const testBuilder = new TestBuilder()
    testBuilder.withRoom()
    await testBuilder.withPlayer()
    const request = testBuilder.createRequest(RequestType.Sell, "sell foo")

    // when
    const check = await sell(request)

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_FAIL_NO_MERCHANT)

    // and
    testBuilder.withMob()

    // when
    const check2 = await sell(request)

    // then
    expect(check2.status).toBe(CheckStatus.Failed)
    expect(check2.result).toBe(MESSAGE_FAIL_NO_MERCHANT)
  })

  it("should fail if the seller does not have the item",  async () => {
    // setup
    const testBuilder = new TestBuilder()
    testBuilder.withRoom()

    // given
    await testBuilder.withPlayer()
    testBuilder.withMerchant()

    // when
    const check = await sell(testBuilder.createRequest(RequestType.Sell, "sell foo"))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_FAIL_ITEM_NOT_IN_INVENTORY)
  })

  it("should succeed if all conditions met", async () => {
    // setup
    const testBuilder = new TestBuilder()
    testBuilder.withRoom()
    const playerBuilder = await testBuilder.withPlayer()
    const item = playerBuilder.withAxeEq()
    testBuilder.withMerchant()

    // when
    const check = await sell(testBuilder.createRequest(RequestType.Sell, `sell ${item.name}`))

    // then
    expect(check.status).toBe(CheckStatus.Ok)
    expect(check.result).toBe(item)
  })
})
