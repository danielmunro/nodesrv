import { Equipment } from "../item/equipment"
import TestBuilder from "../test/testBuilder"
import { RequestType } from "./requestType"
import {newEquipment} from "../item/factory"

describe("request", () => {
  it("should be able to find an item in a request session mob's inventory", async () => {
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer()
    const player = playerBuilder.player
    const item1 = newEquipment("a steel practice shield", "description", Equipment.Shield)
    const item2 = newEquipment("a wooden practice shield", "description", Equipment.Shield)
    player.getInventory().addItem(item1)
    player.getInventory().addItem(item2)
    expect(testBuilder.createRequest(RequestType.Wear, "wear floodle").findItemInSessionMobInventory()).toBeFalsy()
    expect(testBuilder.createRequest(RequestType.Wear, "wear 2.practice").findItemInSessionMobInventory()).toBe(item2)
  })
})
