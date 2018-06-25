import { Equipment } from "../../item/equipment"
import { newEquipment } from "../../item/factory"
import { createRequestArgs, Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import { newSkill } from "../../skill/factory"
import { SkillType } from "../../skill/skillType"
import { getTestMob } from "../../test/mob"
import { getTestPlayer } from "../../test/player"
import { getTestRoom } from "../../test/room"
import { CheckStatus } from "../check"
import buy, { MESSAGE_ERROR_CANNOT_AFFORD, MESSAGE_ERROR_NO_ITEM, MESSAGE_ERROR_NO_MERCHANT } from "./buy"

describe("buy action precondition", () => {
  it("should fail if a merchant is not in the room", async () => {
    // given
    const player = getTestPlayer()
    const room = getTestRoom()
    room.addMob(player.sessionMob)

    // when
    const check = await buy(new Request(player, RequestType.Buy, createRequestArgs("buy foo")))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_ERROR_NO_MERCHANT)
  })

  it("should fail if the merchant doesn't have the item requested", async () => {
    // given
    const player = getTestPlayer()
    const room = getTestRoom()
    room.addMob(player.sessionMob)

    // and
    const merch = getTestMob()
    merch.skills.push(newSkill(SkillType.Haggle))
    room.addMob(merch)

    // when
    const check = await buy(new Request(player, RequestType.Buy, createRequestArgs("buy foo")))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_ERROR_NO_ITEM)
  })

  it("should fail if the item is too expensive", async () => {
    // given
    const player = getTestPlayer()
    const room = getTestRoom()
    room.addMob(player.sessionMob)

    // and
    const merch = getTestMob()
    merch.skills.push(newSkill(SkillType.Haggle))
    room.addMob(merch)

    // and
    const eq = newEquipment("a sombrero", "a robust and eye-catching sombrero", Equipment.Head)
    eq.value = 100
    merch.inventory.addItem(eq)

    // when
    const check = await buy(new Request(player, RequestType.Buy, createRequestArgs("buy sombrero")))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_ERROR_CANNOT_AFFORD)
  })

  it("should succeed if all conditions are met", async () => {
    // given
    const initialGold = 100
    const itemValue = 10

    // and
    const player = getTestPlayer()
    player.sessionMob.gold = initialGold
    const room = getTestRoom()
    room.addMob(player.sessionMob)

    // and
    const merch = getTestMob()
    merch.skills.push(newSkill(SkillType.Haggle))
    room.addMob(merch)

    // and
    const eq = newEquipment("a sombrero", "a robust and eye-catching sombrero", Equipment.Head)
    eq.value = itemValue
    merch.inventory.addItem(eq)

    // when
    const check = await buy(new Request(player, RequestType.Buy, createRequestArgs("buy sombrero")))

    // then
    expect(check.status).toBe(CheckStatus.Ok)
  })
})
