import {createTestAppContainer} from "../app/factory/testFactory"
import { Equipment } from "../item/enum/equipment"
import {newEquipment} from "../item/factory/itemFactory"
import TestRunner from "../support/test/testRunner"
import {Types} from "../support/types"
import { RequestType } from "./enum/requestType"

describe("request", () => {
  it("should be able to find an item in a request session mob's inventory", async () => {
    const testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
    const player = testRunner.createPlayer().player
    const item1 = newEquipment("a steel practice shield", "description", Equipment.Shield)
    const item2 = newEquipment("a wooden practice shield", "description", Equipment.Shield)
    player.getInventory().addItem(item1)
    player.getInventory().addItem(item2)
    expect(testRunner.createRequest(RequestType.Wear, "wear floodle").findItemInSessionMobInventory()).toBeFalsy()
    expect(testRunner.createRequest(RequestType.Wear, "wear 2.practice").findItemInSessionMobInventory()).toBe(item2)
  })
})
