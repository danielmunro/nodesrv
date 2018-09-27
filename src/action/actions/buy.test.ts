import { Equipment } from "../../item/equipment"
import { newEquipment } from "../../item/factory"
import { Role } from "../../mob/role"
import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import { ResponseStatus } from "../../request/responseStatus"
import { getTestMob } from "../../test/mob"
import { getTestPlayer } from "../../test/player"
import { getTestRoom } from "../../test/room"
import TestBuilder from "../../test/testBuilder"
import buy from "./buy"

describe("buy actions actions", () => {
  it("purchaser should receive an item", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const initialGold = 100

    // given
    const merchantBuilder = testBuilder.withMerchant()
    const axe = merchantBuilder.withAxeEq()
    merchantBuilder.withHelmetEq()

    // and
    const playerBuilder = await testBuilder.withPlayer(p => p.sessionMob.gold = initialGold)
    const player = playerBuilder.player

    // when
    const response = await buy(
      testBuilder.createOkCheckedRequest(RequestType.Buy, "buy axe", axe))

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(player.sessionMob.inventory.findItemByName("axe")).not.toBeUndefined()
    expect(player.sessionMob.gold).toBe(initialGold - axe.value)
  })
})
