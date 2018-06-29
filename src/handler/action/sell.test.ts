import { Equipment } from "../../item/equipment"
import { newEquipment } from "../../item/factory"
import { getMerchantMob } from "../../mob/factory"
import { createRequestArgs, Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import { ResponseStatus } from "../../request/responseStatus"
import { getTestPlayer } from "../../test/player"
import { getTestRoom } from "../../test/room"
import Check, { CheckStatus } from "../check"
import CheckedRequest from "../checkedRequest"
import sell from "./sell"

describe("sell handler action", () => {
  it("should execute the sell checked request", async () => {
    // given
    const player = getTestPlayer()
    const initialWorth = player.sessionMob.gold
    const item = newEquipment("a cap", "a cap", Equipment.Head)
    item.value = 10
    player.sessionMob.inventory.addItem(item)
    const merchant = getMerchantMob()
    const room = getTestRoom()
    room.addMob(player.sessionMob)
    room.addMob(merchant)
    const checkedRequest = new CheckedRequest(
      new Request(player, RequestType.Sell, createRequestArgs("sell cap")),
      new Check(CheckStatus.Ok, item),
    )

    // when
    const response = await sell(checkedRequest)

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(player.sessionMob.gold).toBeGreaterThan(initialWorth)
    expect(player.sessionMob.inventory.items).not.toContain(item)
  })
})
