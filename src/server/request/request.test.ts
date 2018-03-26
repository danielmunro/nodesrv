import { RequestType } from "../../handler/constants"
import { Equipment } from "../../item/equipment"
import { Item } from "../../item/model/item"
import { getTestPlayer } from "../../test/player"
import { Request } from "./request"

describe("request", () => {
  it("should be able to find an item in a request session mob's inventory", () => {
    const player = getTestPlayer()
    const item = new Item()
    item.name = "a cracked wooden practice shield"
    item.equipment = Equipment.Shield
    player.getInventory().addItem(item)
    expect(
      new Request(player, RequestType.Look, {request: "wear floodle"}).findItemInSessionMobInventory(),
    ).toBeUndefined()
    expect(
      new Request(player, RequestType.Look, {request: "wear practice"}).findItemInSessionMobInventory(),
    ).toBe(item)
  })
})
