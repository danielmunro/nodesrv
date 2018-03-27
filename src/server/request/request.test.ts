import { RequestType } from "../../handler/constants"
import { Equipment } from "../../item/equipment"
import { Item } from "../../item/model/item"
import { getTestMob } from "../../test/mob"
import { getTestPlayer } from "../../test/player"
import { getTestRoom } from "../../test/room"
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

  it("should be able to find a mob in a room", () => {
    const room = getTestRoom()
    const player = getTestPlayer()
    const bob = getTestMob("bob")
    const alice = getTestMob("alice")
    room.addMob(bob)
    room.addMob(alice)
    room.addMob(getTestMob("sue"))
    room.addMob(player.sessionMob)

    expect(new Request(player, RequestType.Look, {request: "look alice"}).findMobInRoom()).toBe(alice)
    expect(new Request(player, RequestType.Look, {request: "look bob"}).findMobInRoom()).toBe(bob)
    expect(new Request(player, RequestType.Look, {request: "look xander"}).findMobInRoom()).toBeUndefined()
  })
})
