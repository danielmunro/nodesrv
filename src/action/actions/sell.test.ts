import { RequestType } from "../../request/requestType"
import { ResponseStatus } from "../../request/responseStatus"
import TestBuilder from "../../test/testBuilder"
import sell from "./sell"

describe("sell actions actions", () => {
  it("should execute the sell checked request", async () => {
    // given
    const testBuilder = new TestBuilder()
    const item = testBuilder.withPlayer().withTestEquipment()
    testBuilder.withMerchant()

    // and
    const mob = testBuilder.player.sessionMob
    const initialWorth = mob.gold

    // and
    const checkedRequest = testBuilder.createOkCheckedRequest(
      RequestType.Sell,
      "sell cap",
      item)

    // when
    const response = await sell(checkedRequest)

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(mob.gold).toBeGreaterThan(initialWorth)
    expect(mob.inventory.items).not.toContain(item)
  })
})
