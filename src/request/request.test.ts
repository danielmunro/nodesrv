import { RequestType } from "./requestType"
import { Equipment } from "../item/equipment"
import { Item } from "../item/model/item"
import { Player } from "../player/model/player"
import { getTestMob } from "../test/mob"
import { getTestPlayer } from "../test/player"
import { getTestRoom } from "../test/room"
import { createRequestArgs, Request } from "./request"

function newLookRequest(player: Player, args: string): Request {
  return new Request(player, RequestType.Look, createRequestArgs(args))
}

describe("request", () => {
  it("should be able to find an item in a request session mob's inventory", () => {
    const player = getTestPlayer()
    const item = new Item()
    item.name = "a cracked wooden practice shield"
    item.equipment = Equipment.Shield
    player.getInventory().addItem(item)
    expect(newLookRequest(player, "wear floodle").findItemInSessionMobInventory()).toBeUndefined()
    expect(newLookRequest(player, "wear practice").findItemInSessionMobInventory()).toBe(item)
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

    expect(newLookRequest(player, "look alice").findMobInRoom()).toBe(alice)
    expect(newLookRequest(player, "look bob").findMobInRoom()).toBe(bob)
    expect(newLookRequest(player, "look xander").findMobInRoom()).toBeUndefined()
  })
})
