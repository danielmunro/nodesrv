import { Equipment } from "../../item/equipment"
import { Item } from "../../item/model/item"
import { Request } from "../../server/request/request"
import { getTestPlayer } from "../../test/player"
import { RequestType } from "../constants"
import remove, { MESSAGE_FAIL } from "./remove"

function getTestShield(): Item {
  const item = new Item()
  item.equipment = Equipment.Shield
  item.name = "a test shield"

  return item
}

describe("remove", () => {
  it("should not work if an item is not equipped", () => {
    expect.assertions(1)
    return remove(new Request(getTestPlayer(), RequestType.Remove, {request: "remove foo"}))
      .then((response) => expect(response.message).toBe(MESSAGE_FAIL))
  })

  it("can remove an equipped item", () => {
    const player = getTestPlayer()
    player.sessionMob.equipped.inventory.addItem(getTestShield())

    expect.assertions(1)

    return remove(new Request(player, RequestType.Remove, {request: "remove shield"}))
      .then((response) => expect(response.message).toContain("You remove"))
  })
})
