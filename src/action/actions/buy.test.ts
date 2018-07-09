import { Equipment } from "../../item/equipment"
import { newEquipment } from "../../item/factory"
import { createRequestArgs, Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import { ResponseStatus } from "../../request/responseStatus"
import { newSkill } from "../../skill/factory"
import { SkillType } from "../../skill/skillType"
import { getTestMob } from "../../test/mob"
import { getTestPlayer } from "../../test/player"
import { getTestRoom } from "../../test/room"
import buy from "./buy"

describe("buy actions actions", () => {
  it("purchaser should receive an item", async () => {
    // given
    const room = getTestRoom()
    const initialGold = 100
    const itemValue = 10

    // and
    const merch = getTestMob()
    merch.skills.push(newSkill(SkillType.Haggle))
    room.addMob(merch)

    // and
    const eq = newEquipment("a baseball cap", "a baseball cap is here", Equipment.Head)
    eq.value = itemValue
    merch.inventory.addItem(eq)

    // and
    const player = getTestPlayer()
    player.sessionMob.gold = initialGold
    room.addMob(player.sessionMob)

    // when
    const response = await buy(new Request(player, RequestType.Buy, createRequestArgs("buy cap")))

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(player.sessionMob.inventory.findItemByName("cap")).not.toBeUndefined()
    expect(player.sessionMob.gold).toBe(initialGold - itemValue)
  })
})
