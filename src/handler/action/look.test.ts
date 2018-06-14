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
    expect.assertions(1)

    await useLookRequest(player, "look")
      .then((response) => expect(response.room).toBe(room))
  })

  it("should let the player know if the thing they want to look at does not exist", async () => {
    expect.assertions(1)
    await useLookRequest(getTestPlayer(), "look foo")
      .then((response) => expect(response.message).toBe(NOT_FOUND))
  })

  it("should describe a mob when a mob is present", async () => {
    const room = getTestRoom()
    const player = getTestPlayer()
    room.addMob(player.sessionMob)
    const mob = getTestMob("alice")
    room.addMob(mob)
    expect.assertions(1)

    await useLookRequest(player, "look alice")
      .then((response) => expect(response).toEqual({ mob }))
  })

  it("should be able to describe an item in the room", async () => {
    const room = getTestRoom()
    const item = new Item()
    item.name = "a pirate hat"
    room.inventory.addItem(item)
    const player = getTestPlayer()
    room.addMob(player.sessionMob)
    expect.assertions(1)

    await useLookRequest(player, "look pirate")
      .then((response) => expect(response).toEqual({ item }))
  })

  it("should be able to describe an item in the session mob's inventory", async () => {
    const room = getTestRoom()
    const player = getTestPlayer()
    const item = new Item()
    item.name = "a pirate hat"
    player.sessionMob.inventory.addItem(item)
    room.addMob(player.sessionMob)
    expect.assertions(1)

    await useLookRequest(player, "look pirate")
      .then((response) => expect(response).toEqual({ item }))
  })
})
