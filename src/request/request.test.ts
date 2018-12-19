import { Equipment } from "../item/equipment"
import { Item } from "../item/model/item"
import TestBuilder from "../test/testBuilder"
import { RequestType } from "./requestType"

describe("request", () => {
  it("should be able to find an item in a request session mob's inventory", async () => {
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer()
    const player = playerBuilder.player
    const item = new Item()
    item.name = "a cracked wooden practice shield"
    item.equipment = Equipment.Shield
    player.getInventory().addItem(item)
    expect(testBuilder.createRequest(RequestType.Wear, "wear floodle").findItemInSessionMobInventory()).toBeFalsy()
    expect(testBuilder.createRequest(RequestType.Wear, "wear practice").findItemInSessionMobInventory()).toBe(item)
  })
})
