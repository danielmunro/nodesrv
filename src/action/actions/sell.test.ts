import CheckedRequest from "../../check/checkedRequest"
import { RequestType } from "../../request/requestType"
import { ResponseStatus } from "../../request/responseStatus"
import TestBuilder from "../../test/testBuilder"
import sellPrecondition from "../precondition/sell"
import sell from "./sell"

describe("sell actions actions", () => {
  it("should execute the sell checked request", async () => {
    // given
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer()
    const item = playerBuilder.withHelmetEq()
    testBuilder.withMerchant()

    // and
    const mob = testBuilder.player.sessionMob
    const initialWorth = mob.gold

    // and
    const request = testBuilder.createRequest(RequestType.Sell, "sell cap")
    const check = await sellPrecondition(request)

    // when
    const response = await sell(new CheckedRequest(request, check))

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(mob.gold).toBeGreaterThan(initialWorth)
    expect(mob.inventory.items).not.toContain(item)
  })
})
