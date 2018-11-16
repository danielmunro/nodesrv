import { Equipment } from "../item/equipment"
import { Item } from "../item/model/item"
import { getTestMob } from "../test/mob"
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
    expect(testBuilder.createRequest(RequestType.Wear, "wear floodle").findItemInSessionMobInventory()).toBeUndefined()
    expect(testBuilder.createRequest(RequestType.Wear, "wear practice").findItemInSessionMobInventory()).toBe(item)
  })

  it("should be able to find a mob in a room", async () => {
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer()
    const player = playerBuilder.player
    const room = testBuilder.withRoom().room
    const bob = getTestMob("bob")
    const alice = getTestMob("alice")
    room.addMob(bob)
    room.addMob(alice)
    room.addMob(getTestMob("sue"))
    room.addMob(player.sessionMob)

    expect(testBuilder.createRequest(RequestType.Wear, "look alice").findMobInRoom()).toBe(alice)
    expect(testBuilder.createRequest(RequestType.Wear, "look bob").findMobInRoom()).toBe(bob)
    expect(testBuilder.createRequest(RequestType.Wear, "look xander").findMobInRoom()).toBeUndefined()
  })
})
