import { Item } from "../../item/model/item"
import { Player } from "../../player/model/player"
import { createRequestArgs, Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import { getTestMob } from "../../test/mob"
import { getTestPlayer } from "../../test/player"
import { getTestRoom } from "../../test/room"
import look, { NOT_FOUND } from "./look"

function useLookRequest(player: Player, input: string) {
  return look(new Request(player, RequestType.Look, createRequestArgs(input)))
}

describe("look", () => {
  it("should describe a room when no arguments are provided", async () => {
    const room = getTestRoom()
    const player = getTestPlayer()
    room.addMob(player.sessionMob)
    const response = await useLookRequest(player, "look")
    expect(response.message).toContain(room.name)
    expect(response.message).toContain(room.description)
  })

  it("should let the player know if the thing they want to look at does not exist", async () => {
    const response = await useLookRequest(getTestPlayer(), "look foo")
    expect(response.message).toBe(NOT_FOUND)
  })

  it("should describe a mob when a mob is present", async () => {
    const room = getTestRoom()
    const player = getTestPlayer()
    room.addMob(player.sessionMob)
    const mob = getTestMob("alice")
    room.addMob(mob)
    const response = await useLookRequest(player, "look alice")
    expect(response.message).toBe(mob.description)
  })

  it("should be able to describe an item in the room", async () => {
    const room = getTestRoom()
    const item = new Item()
    item.name = "a pirate hat"
    item.description = "this is a test item"
    room.inventory.addItem(item)
    const player = getTestPlayer()
    room.addMob(player.sessionMob)
    const response = await useLookRequest(player, "look pirate")
    expect(response.message).toBe(item.description)
  })

  it("should be able to describe an item in the session mob's inventory", async () => {
    const room = getTestRoom()
    const player = getTestPlayer()
    const item = new Item()
    item.name = "a pirate hat"
    item.description = "this is a test item"
    player.sessionMob.inventory.addItem(item)
    room.addMob(player.sessionMob)
    const response = await useLookRequest(player, "look pirate")
    expect(response.message).toBe(item.description)
  })
})
