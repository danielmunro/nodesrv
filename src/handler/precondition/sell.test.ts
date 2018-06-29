import { getTestRoom } from "../../test/room"
import sell, { MESSAGE_FAIL_NO_ITEM, MESSAGE_FAIL_NO_MERCHANT } from "./sell"
import { createRequestArgs, Request } from "../../request/request"
import { getTestPlayer } from "../../test/player"
import { RequestType } from "../../request/requestType"
import { CheckStatus } from "../check"
import { getTestMob } from "../../test/mob"
import { Mob } from "../../mob/model/mob"
import { newEquipment } from "../../item/factory"
import { Equipment } from "../../item/equipment"
import { getMerchantMob } from "../../mob/factory"

function getNonMerchantMob(): Mob {
  return getTestMob()
}

describe("sell handler action precondition", () => {
  it("should fail if a merchant is not in the room", async () => {
    // given
    const player = getTestPlayer()

    // when
    const check = await sell(new Request(player, RequestType.Sell, createRequestArgs("sell foo")))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_FAIL_NO_MERCHANT)

    // and
    const room = getTestRoom()
    room.addMob(player.sessionMob)
    room.addMob(getNonMerchantMob())

    // when
    const check2 = await sell(new Request(player, RequestType.Sell, createRequestArgs("sell foo")))

    // then
    expect(check2.status).toBe(CheckStatus.Failed)
    expect(check2.result).toBe(MESSAGE_FAIL_NO_MERCHANT)
  })

  it("should fail if the seller does not have the item",  async () => {
    // given
    const room = getTestRoom()
    const player = getTestPlayer()
    room.addMob(player.sessionMob)
    room.addMob(getMerchantMob())

    // when
    const check = await sell(new Request(player, RequestType.Sell, createRequestArgs("sell foo")))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_FAIL_NO_ITEM)
  })

  it("should succeed if all conditions met", async () => {
    // given
    const room = getTestRoom()
    const player = getTestPlayer()
    const item = newEquipment("a baseball cap", "a baseball cap", Equipment.Head)
    item.value = 10
    player.sessionMob.inventory.addItem(item)
    room.addMob(player.sessionMob)
    room.addMob(getMerchantMob())

    // when
    const check = await sell(new Request(player, RequestType.Sell, createRequestArgs("sell cap")))

    // then
    expect(check.status).toBe(CheckStatus.Ok)
    expect(check.result).toBe(item)
  })
})
